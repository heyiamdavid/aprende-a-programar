// Classic (non-module) Web Worker for Pyodide
// Runs Python in a background thread using SharedArrayBuffer for synchronous stdin.
// APPROACH: Instead of setStdin (which conflicts with Python's IO layer and causes
// OSError ESPIPE), we directly override Python's built-in input() function via
// Pyodide's js module to call a blocking JS function with Atomics.wait.

let pyodide = null;

// Global Int32Array and Uint8Array views over the SharedArrayBuffer.
// Updated on every RUN_CODE message.
var globalControlArray = null;
var globalTextArray = null;

// This function is called from Python via `js.__blocking_input(prompt)`.
// It blocks the Worker thread using Atomics.wait until the main thread
// writes the user's input into the shared buffer.
self.__blocking_input = function (prompt) {
  // Reset control flag to 0 (waiting)
  Atomics.store(globalControlArray, 0, 0);

  // Ask the main thread to show the custom input modal with the real prompt text
  self.postMessage({ type: 'REQUEST_INPUT', prompt: prompt || '' });

  // Block this Worker thread (60s timeout)
  var result = Atomics.wait(globalControlArray, 0, 0, 60000);
  if (result === 'timed-out') {
    return '';
  }

  // Read the UTF-8 encoded response from the shared buffer
  var length = 0;
  while (length < globalTextArray.length && globalTextArray[length] !== 0) {
    length++;
  }
  // Copy to a non-shared ArrayBuffer before decoding, as TextDecoder does not accept SharedArrayBuffer views
  var bytesCopy = new Uint8Array(globalTextArray.slice(0, length));
  return new TextDecoder().decode(bytesCopy);
};

self.onmessage = async function (e) {
  var msg = e.data;

  if (msg.type === 'INIT') {
    try {
      importScripts('https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js');
      pyodide = await loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
      });

      // Override Python's built-in input() to use our blocking JS function.
      // This completely bypasses Pyodide's setStdin/IO stream system,
      // avoiding the OSError: [Errno 29] ESPIPE that occurs otherwise.
      pyodide.runPython([
        'import builtins, js',
        'def _js_input(prompt=""):',
        '    return str(js.__blocking_input(str(prompt) if prompt else ""))',
        'builtins.input = _js_input',
      ].join('\n'));

      self.postMessage({ type: 'READY' });
    } catch (err) {
      self.postMessage({
        type: 'ERROR',
        error: 'Error inicializando Python: ' + (err.message ?? String(err)),
      });
    }
    return;
  }

  if (msg.type === 'RUN_CODE') {
    if (!pyodide) {
      self.postMessage({ type: 'ERROR', error: 'Pyodide aún no está listo.' });
      return;
    }

    var code = msg.code;
    var sharedBuffer = msg.sharedBuffer;

    // Update global SAB views for this execution run
    globalControlArray = new Int32Array(sharedBuffer, 0, 2);
    globalTextArray = new Uint8Array(sharedBuffer, 8);

    // Redirect stdout and stderr to the main thread
    pyodide.setStdout({
      batched: function (text) {
        self.postMessage({ type: 'STDOUT', text: text });
      },
    });
    pyodide.setStderr({
      batched: function (text) {
        self.postMessage({ type: 'STDERR', text: text });
      },
    });
    // No setStdin needed — input() is already overridden in Python builtins.

    try {
      // Use synchronous runPython (not runPythonAsync) so that Atomics.wait
      // inside __blocking_input can pause the Worker thread correctly.
      pyodide.runPython(code);
      self.postMessage({ type: 'DONE' });
    } catch (err) {
      self.postMessage({ type: 'ERROR', error: String(err) });
    }
  }
};
