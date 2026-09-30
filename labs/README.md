# Original foundation practice pack
These are original low-level observation exercises, not OffSec targets or exploit solutions.
Use the **x86** binaries under `bin/` in a disposable Windows VM without work credentials.
They do not listen on the network, alter system mitigations, or run payloads. The crash exercise deliberately faults only when explicitly given `--crash`.

## F01: Byte foundry (in the application)
Generate a new exercise, predict little-endian bytes, check, then write a Python `struct.pack('<I', value)` roundtrip outside the app. Explain why textual hexadecimal is not the same as the resulting bytes.

## F02: Pointer maze
Run `pointer-maze.exe 7`, then `pointer-maze.exe 19`. Before each run, predict each element value and relative address. Observe `sizeof(void*)`; the supplied Windows targets must report 4. Inspect the same array in WinDbg. Record what stayed constant and what changed.

## F03: Stack cartographer
Open `call-trace.exe` with its PDB in WinDbg. Break at `add_caller` and `add_callee`. Identify argument positions and compare generated stack cleanup for cdecl and stdcall. Check register/stack predictions one instruction at a time. Do not generalise these x86 conventions to x64.

## F04: Crash detective
Run `crash-detective.exe --self-test` first. In your VM, launch it in WinDbg with `--crash`. Identify the exact faulting instruction, access type and effective address. Explain the input-to-pointer relationship. Distinguish an invalid data access from controlled EIP. Change the source to reject the invalid selection, rebuild and verify the fix. Do not run the intentional crash on your work host.

## F05: Branch hunter
Analyse `branch-hunter.exe` without first reading its source. Find the input checks, hypothesise a valid record and compare runtime branches against static analysis. Explain how each failed condition changes the result. Then inspect the source to test your model. Repeating the same token is review, not a fresh assessment.

## F06: Module atlas
Run `module-atlas.exe`, inspect the image with WinDbg and reconcile module base, function VA and function RVA. Verify page protection with the debugger. Repeat fresh launches; do not assume every launch forces a different image base.

## Evidence
Record compiler and architecture, prediction, observed debugger state, root cause, exact reproduction steps, assistance used and next experiment. The app records these as **self-reported** VM observations. Automatic answers validate only the separate mathematical simulations.

## Building
Use an **x86 Native Tools Command Prompt for Visual Studio**, then run `build.cmd`. The workflow selects the x86 compiler and preserves PDBs. These five programs are foundation exercises, not a complete stack/SEH/shellcode/ROP/ASLR curriculum. Advanced app entries remain practice briefs.
