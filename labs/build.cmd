@echo off
setlocal
cd /d "%~dp0"
if not exist bin mkdir bin
for %%T in (pointer-maze call-trace branch-hunter crash-detective module-atlas) do (
  cl /nologo /W4 /Od /Zi /GS /MT "%%T.c" /Fo"bin\%%T.obj" /Fe"bin\%%T.exe" /Fd"bin\%%T-compiler.pdb" /link /DEBUG /PDB:"bin\%%T.pdb" /DYNAMICBASE /NXCOMPAT
  if errorlevel 1 exit /b 1
)
bin\pointer-maze.exe 7
if errorlevel 1 exit /b 1
bin\call-trace.exe
if errorlevel 1 exit /b 1
bin\branch-hunter.exe --self-test
if errorlevel 1 exit /b 1
bin\crash-detective.exe --self-test
if errorlevel 1 exit /b 1
bin\module-atlas.exe
if errorlevel 1 exit /b 1
exit /b 0
