/// <reference lib="webworker" />

// Types for messages received from the main thread
type WorkerInMessage =
  | { type: 'INIT' }
  | { type: 'RUN_CODE'; code: string; sharedBuffer: SharedArrayBuffer };

// Types for messages sent to the main thread
type WorkerOutMessage =
  | { type: 'READY' }
  | { type: 'STDOUT'; text: string }
  | { type: 'STDERR'; text: string }
  | { type: 'DONE' }
  | { type: 'ERROR'; error: string }
  | { type: 'REQUEST_INPUT'; prompt: string };

declare const self: DedicatedWorkerGlobalScope & {
  loadPyodide: (opts: { indexURL: string }) => Promise<any>;
};

let pyodide: any = null;

async function initPyodide() {
  // Load Pyodide inside the worker
  importScripts('https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js');
  pyodide = await self.loadPyodide({
    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
  });
  (self as DedicatedWorkerGlobalScope).postMessage({ type: 'READY' } as WorkerOutMessage);
}

self.onmessage = async (event: MessageEvent<WorkerInMessage>) => {
  const msg = event.data;

  if (msg.type === 'INIT') {
    try {
      await initPyodide();
    } catch (err: any) {
      (self as DedicatedWorkerGlobalScope).postMessage({
        type: 'ERROR',
        error: `Error inicializando Python: ${err?.message ?? err}`,
      } as WorkerOutMessage);
    }
    return;
  }

  if (msg.type === 'RUN_CODE') {
    if (!pyodide) {
      (self as DedicatedWorkerGlobalScope).postMessage({
        type: 'ERROR',
        error: 'Pyodide aún no está listo.',
      } as WorkerOutMessage);
      return;
    }

    const { code, sharedBuffer } = msg;

    // Int32Array view over the shared buffer.
    // Index 0: state flag (0 = waiting for input, 1 = input ready)
    // Index 1+: not used for state, but the text is written separately via a Uint8Array
    const controlArray = new Int32Array(sharedBuffer, 0, 2);
    // Text input is stored starting at byte offset 8 (after the 2 Int32 values = 8 bytes)
    const textArray = new Uint8Array(sharedBuffer, 8);

    // Wire stdout
    pyodide.setStdout({
      batched: (text: string) => {
        (self as DedicatedWorkerGlobalScope).postMessage({ type: 'STDOUT', text } as WorkerOutMessage);
      },
    });

    // Wire stderr
    pyodide.setStderr({
      batched: (text: string) => {
        (self as DedicatedWorkerGlobalScope).postMessage({ type: 'STDERR', text } as WorkerOutMessage);
      },
    });

    // Wire stdin — this BLOCKS the worker thread using Atomics.wait
    pyodide.setStdin({
      stdin: () => {
        // Reset the flag to 0 (waiting)
        Atomics.store(controlArray, 0, 0);

        // Send the REQUEST_INPUT message to the main thread
        // We pass an empty prompt since Python already printed it via stdout
        (self as DedicatedWorkerGlobalScope).postMessage({
          type: 'REQUEST_INPUT',
          prompt: '',
        } as WorkerOutMessage);

        // Block this worker thread until the main thread writes a 1 into controlArray[0]
        Atomics.wait(controlArray, 0, 0);

        // Read the UTF-8 encoded response from the shared buffer
        // Find the null terminator to know where text ends
        let length = 0;
        while (length < textArray.length && textArray[length] !== 0) {
          length++;
        }
        const inputText = new TextDecoder().decode(textArray.subarray(0, length));
        return inputText;
      },
    });

    try {
      await pyodide.runPythonAsync(code);
      (self as DedicatedWorkerGlobalScope).postMessage({ type: 'DONE' } as WorkerOutMessage);
    } catch (err: any) {
      (self as DedicatedWorkerGlobalScope).postMessage({
        type: 'ERROR',
        error: String(err),
      } as WorkerOutMessage);
    }
  }
};
