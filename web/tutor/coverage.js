// Source-heading inventory from uploaded EXP-301 v1.0, TOC pages 3–13. Indexing is not teaching or lab completion.
const inventory=`1|14|Windows User Mode Exploit Development: General Course Information
1.1|14|About the EXP-301 Course
1.2|15|Provided Materials
1.2.1|15|EXP-301 Course Materials
1.2.2|15|Access to the Internal VPN Lab Network
1.2.3|16|The Offensive Security Student Forum
1.2.4|16|Live Support and RocketChat
1.2.5|16|OSED Exam Attempt
1.3|17|Overall Strategies for Approaching the Course
1.3.1|17|Welcome and Course Information Emails
1.3.2|17|Course Materials
1.3.3|17|Course Exercises
1.4|18|About the EXP-301 VPN Labs
1.4.1|18|Control Panel
1.4.2|18|Reverts
1.4.3|19|Kali Virtual Machine
1.4.4|19|Lab Behavior and Lab Restrictions
1.5|19|About the OSED Exam
1.6|20|Wrapping Up
2|21|WinDbg and x86 Architecture
2.1|21|Introduction to x86 Architecture
2.1.1|21|Program Memory
2.1.1.1|22|The Stack
2.1.1.2|22|Calling conventions
2.1.1.3|22|Function Return Mechanics
2.1.2|23|CPU Registers
2.1.2.1|24|General Purpose Registers
2.1.2.2|24|ESP - The Stack Pointer
2.1.2.3|24|EBP - The Base Pointer
2.1.2.4|24|EIP - The Instruction Pointer
2.2|25|Introduction to Windows Debugger
2.2.1|25|What is a Debugger?
2.2.2|26|WinDbg Interface
2.2.3|28|Understanding the Workspace
2.2.3.1|30|Exercises
2.2.4|30|Debugging Symbols
2.3|32|Accessing and Manipulating Memory from WinDbg
2.3.1|32|Unassemble from Memory
2.3.1.1|32|Exercises
2.3.2|32|Reading from Memory
2.3.2.1|36|Exercise
2.3.3|36|Dumping Structures from Memory
2.3.3.1|38|Exercise
2.3.4|38|Writing to Memory
2.3.4.1|39|Exercises
2.3.5|39|Searching the Memory Space
2.3.5.1|40|Exercises
2.3.6|40|Inspecting and Editing CPU Registers in WinDbg
2.3.6.1|41|Exercise
2.4|41|Controlling the Program Execution in WinDbg
2.4.1|41|Software Breakpoints
2.4.1.1|43|Exercises
2.4.2|43|Unresolved Function Breakpoint
2.4.2.1|45|Exercises
2.4.3|45|Breakpoint-Based Actions
2.4.3.1|47|Exercises
2.4.4|47|Hardware Breakpoints
2.4.4.1|50|Exercises
2.4.5|50|Stepping Through the Code
2.4.5.1|52|Exercises
2.5|52|Additional WinDbg Features
2.5.1|52|Listing Modules and Symbols in WinDbg
2.5.2|54|Using WinDbg as a Calculator
2.5.3|54|Data Output Format
2.5.3.1|55|Exercise
2.5.4|55|Pseudo Registers
2.6|56|Wrapping Up
3|57|Exploiting Stack Overflows
3.1|57|Stack Overflows Introduction
3.2|60|Installing the Sync Breeze Application
3.2.1.1|61|Exercise
3.3|61|Crashing the Sync Breeze Application
3.3.1.1|63|Exercise
3.4|64|Win32 Buffer Overflow Exploitation
3.4.1|64|A Word About DEP, ASLR, and CFG
3.4.2|64|Controlling EIP
3.4.2.1|67|Exercises
3.4.3|67|Locating Space for Our Shellcode
3.4.3.1|70|Exercises
3.4.4|70|Checking for Bad Characters
3.4.4.1|72|Exercises
3.4.5|72|Redirecting the Execution Flow
3.4.6|72|Finding a Return Address
3.4.6.1|80|Exercises
3.4.7|81|Generating Shellcode with Metasploit
3.4.7.1|83|Exercises
3.4.8|83|Getting a Shell
3.4.8.1|86|Exercises
3.4.9|86|Improving the Exploit
3.4.9.1|87|Exercise
3.4.9.2|87|Extra Mile
3.5|87|Wrapping Up
4|88|Exploiting SEH Overflows
4.1|88|Installing the Sync Breeze Application
4.1.1.1|90|Exercise
4.2|90|Crashing Sync Breeze
4.2.1.1|91|Exercise
4.3|91|Analyzing the Crash in WinDbg
4.3.1.1|93|Exercises
4.4|93|Introduction to Structured Exception Handling
4.4.1|94|Understanding SEH
4.4.2|99|SEH Validation
4.4.2.1|102|Exercises
4.5|102|Structured Exception Handler Overflows
4.5.1.1|112|Exercises
4.5.2|113|Gaining Code Execution
4.5.2.1|116|Exercises
4.5.3|116|Detecting Bad Characters
4.5.3.1|118|Exercise
4.5.4|118|Finding a P/P/R Instruction Sequence
4.5.4.1|124|Exercises
4.5.5|124|Island-Hopping in Assembly
4.5.5.1|130|Exercises
4.5.6|131|Obtaining a Shell
4.5.6.1|133|Exercises
4.5.6.2|133|Extra Mile
4.5.6.3|133|Extra Mile
4.6|134|Wrapping Up
5|135|Introduction to IDA Pro
5.1|135|IDA Pro 101
5.1.1|136|Installing IDA Pro
5.1.1.1|136|Exercise
5.1.2|136|The IDA Pro User Interface
5.1.2.1|144|Exercises
5.1.3|144|Basic Functionality
5.1.3.1|148|Exercises
5.1.4|148|Search Functionality
5.1.4.1|150|Exercises
5.2|151|Working with IDA Pro
5.2.1|151|Static-Dynamic Analysis Synchronization
5.2.1.1|153|Exercises
5.2.2|153|Tracing Notepad
5.2.2.1|156|Exercises
5.3|157|Wrapping Up
6|158|Overcoming Space Restrictions: Egghunters
6.1|158|Crashing the Savant Web Server
6.1.1.1|159|Exercises
6.2|160|Analyzing the Crash in WinDbg
6.2.1.1|161|Exercises
6.3|161|Detecting Bad Characters
6.3.1.1|164|Exercises
6.4|164|Gaining Code Execution
6.4.1.1|166|Exercises
6.4.2|166|Partial EIP Overwrite
6.4.2.1|172|Exercises
6.4.3|172|Changing the HTTP Method
6.4.3.1|175|Exercises
6.4.4|175|Conditional Jumps
6.4.4.1|179|Exercises
6.5|180|Finding Alternative Places to Store Large Buffers
6.5.1.1|181|Exercises
6.5.2|182|The Windows Heap Memory Manager
6.5.2.1|184|Exercises
6.6|184|Finding our Buffer - The Egghunter Approach
6.6.1|185|Keystone Engine
6.6.1.1|187|Exercises
6.6.2|187|System Calls and Egghunters
6.6.2.1|195|Exercises
6.6.3|196|Identifying and Addressing the Egghunter Issue
6.6.3.1|200|Exercises
6.6.4|200|Obtaining a Shell
6.6.4.1|203|Exercises
6.7|204|Improving the Egghunter Portability Using SEH
6.7.1.1|215|Exercises
6.7.2|215|Identifying the SEH-Based Egghunter Issue
6.7.2.1|226|Exercises
6.7.3|227|Porting the SEH Egghunter to Windows 10
6.7.3.1|231|Exercises
6.7.3.2|232|Extra Mile
6.8|232|Wrapping Up
7|233|Creating Custom Shellcode
7.1|233|Calling Conventions on x86
7.2|234|The System Call Problem
7.3|235|Finding kernel32.dll
7.3.1|236|PEB Method
7.3.1.1|238|Exercises
7.3.2|238|Assembling the Shellcode
7.3.2.1|244|Exercises
7.4|244|Resolving Symbols
7.4.1|245|Export Directory Table
7.4.1.1|247|Exercise
7.4.2|247|Working with the Export Names Array
7.4.2.1|253|Exercises
7.4.3|253|Computing Function Name Hashes
7.4.3.1|258|Exercises
7.4.4|258|Fetching the VMA of a Function
7.4.4.1|263|Exercises
7.5|263|NULL-Free Position-Independent Shellcode (PIC)
7.5.1|264|Avoiding NULL Bytes
7.5.1.1|265|Exercise
7.5.2|265|Position-Independent Shellcode
7.5.2.1|270|Exercises
7.6|270|Reverse Shell
7.6.1|271|Loading ws2_32.dll and Resolving Symbols
7.6.1.1|274|Exercises
7.6.2|274|Calling WSAStartup
7.6.2.1|277|Exercises
7.6.3|278|Calling WSASocket
7.6.3.1|280|Exercises
7.6.4|280|Calling WSAConnect
7.6.4.1|285|Exercises
7.6.5|285|Calling CreateProcessA
7.6.5.1|290|Exercises
7.6.5.2|291|Extra Miles
7.7|291|Wrapping Up
8|292|Reverse Engineering for Bugs
8.1|292|Installation and Enumeration
8.1.1|293|Installing Tivoli Storage Manager
8.1.1.1|294|Exercise
8.1.2|294|Enumerating an Application
8.1.2.1|296|Exercises
8.2|296|Interacting with Tivoli Storage Manager
8.2.1|296|Hooking the recv API
8.2.1.1|299|Exercises
8.2.2|299|Synchronizing WinDbg and IDA Pro
8.2.2.1|301|Exercises
8.2.3|301|Tracing the Input
8.2.3.1|304|Exercise
8.2.4|304|Checksum, Please
8.2.4.1|320|Exercise
8.3|320|Reverse Engineering the Protocol
8.3.1|320|Header-Data Separation
8.3.1.1|332|Exercise
8.3.2|333|Reversing the Header
8.3.2.1|342|Exercises
8.3.3|342|Exploiting Memcpy
8.3.3.1|348|Exercise
8.3.4|348|Getting EIP Control
8.3.4.1|351|Exercise
8.3.4.2|351|Extra Mile
8.4|351|Digging Deeper to Find More Bugs
8.4.1|352|Switching Execution
8.4.1.1|357|Exercises
8.4.2|357|Going Down 0x534
8.4.2.1|367|Exercises
8.4.2.2|367|Extra Mile
8.4.2.3|367|Extra Mile
8.5|368|Wrapping Up
9|369|Stack Overflows and DEP Bypass
9.1|369|Data Execution Prevention
9.1.1|369|DEP Theory
9.1.1.1|371|Exercises
9.1.2|372|Windows Defender Exploit Guard
9.1.2.1|375|Exercises
9.2|375|Return Oriented Programming
9.2.1|375|Origins of Return Oriented Programming Exploitation
9.2.2|376|Return Oriented Programming Evolution
9.3|379|Gadget Selection
9.3.1|379|Debugger Automation: Pykd
9.3.1.1|388|Exercises
9.3.2|388|Optimized Gadget Discovery: RP++
9.3.2.1|390|Exercises
9.4|390|Bypassing DEP
9.4.1|391|Getting The Offset
9.4.1.1|393|Exercises
9.4.2|393|Locating Gadgets
9.4.2.1|394|Exercise
9.4.3|394|Preparing the Battlefield
9.4.3.1|397|Exercises
9.4.4|397|Making ROP’s Acquaintance
9.4.4.1|399|Exercises
9.4.5|400|Obtaining VirtualAlloc Address
9.4.5.1|408|Exercises
9.4.6|408|Patching the Return Address
9.4.6.1|413|Exercises
9.4.7|414|Patching Arguments
9.4.7.1|420|Exercises
9.4.8|421|Executing VirtualAlloc
9.4.8.1|426|Exercises
9.4.9|427|Getting a Reverse Shell
9.4.9.1|428|Exercises
9.4.9.2|428|Extra Mile
9.4.9.3|429|Extra Mile
9.4.9.4|429|Extra Mile
9.5|429|Wrapping Up
10|430|Stack Overflows and ASLR Bypass
10.1|430|ASLR Introduction
10.1.1|430|ASLR Implementation
10.1.2|431|ASLR Bypass Theory
10.1.3|433|Windows Defender Exploit Guard and ASLR
10.1.3.1|438|Exercises
10.2|438|Finding Hidden Gems
10.2.1|438|FXCLI_DebugDispatch
10.2.1.1|444|Exercises
10.2.2|444|Arbitrary Symbol Resolution
10.2.2.1|451|Exercises
10.2.3|451|Returning the Goods
10.2.3.1|460|Exercises
10.3|460|Expanding our Exploit (ASLR Bypass)
10.3.1|461|Leaking an IBM Module
10.3.1.1|463|Exercises
10.3.2|463|Is That a Bad Character?
10.3.2.1|465|Exercises
10.4|466|Bypassing DEP with WriteProcessMemory
10.4.1|466|WriteProcessMemory
10.4.1.1|478|Exercises
10.4.2|478|Getting Our Shell
10.4.2.1|481|Exercises
10.4.3|481|Handmade ROP Decoder
10.4.3.1|487|Exercises
10.4.4|487|Automating the Shellcode Encoding
10.4.4.1|488|Exercises
10.4.5|488|Automating the ROP Decoder
10.4.5.1|494|Exercises
10.4.5.2|494|Extra Mile
10.4.5.3|494|Extra Mile
10.4.5.4|495|Extra Mile
10.4.5.5|495|Extra Mile
10.5|495|Wrapping Up
11|496|Format String Specifier Attack Part I
11.1|496|Format String Attacks
11.1.1|496|Format String Theory
11.1.2|498|Exploiting Format String Specifiers
11.1.2.1|501|Exercise
11.2|501|Attacking IBM Tivoli FastBackServer
11.2.1|501|Investigating the EventLog Function
11.2.1.1|505|Exercise
11.2.2|505|Reverse Engineering a Path
11.2.2.1|511|Exercises
11.2.3|511|Invoke the Specifiers
11.2.3.1|515|Exercise
11.3|516|Reading the Event Log
11.3.1|516|The Tivoli Event Log
11.3.1.1|520|Exercise
11.3.2|520|Remote Event Log Service
11.3.2.1|528|Exercise
11.3.3|528|Read From an Index
11.3.3.1|539|Exercise
11.3.4|539|Read From the Log
11.3.4.1|544|Exercise
11.3.5|545|Return the Log Content
11.3.5.1|548|Exercises
11.4|548|Bypassing ASLR with Format Strings
11.4.1|548|Parsing the Event Log
11.4.1.1|553|Exercises
11.4.2|554|Leak Stack Address Remotely
11.4.2.1|557|Exercises
11.4.3|557|Saving the Stack
11.4.3.1|559|Exercises
11.4.4|559|Bypassing ASLR
11.4.4.1|566|Exercises
11.4.4.2|567|Extra Mile
11.4.4.3|567|Extra Mile
11.5|567|Wrapping Up
12|568|Format String Specifier Attack Part II
12.1|568|Write Primitive with Format Strings
12.1.1|568|Format String Specifiers Revisited
12.1.1.1|570|Exercise
12.1.2|570|Overcoming Limitations
12.1.2.1|578|Exercises
12.1.3|578|Write to the Stack
12.1.3.1|582|Exercises
12.1.4|583|Going for a DWORD
12.1.4.1|584|Exercises
12.2|584|Overwriting EIP with Format Strings
12.2.1|585|Locating a Target
12.2.1.1|587|Exercises
12.2.2|587|Obtaining EIP Control
12.2.2.1|588|Exercise
12.3|588|Locating Storage Space
12.3.1|589|Finding Buffers
12.3.1.1|592|Exercises
12.3.2|592|Stack Pivot
12.3.2.1|595|Exercise
12.4|595|Getting Code Execution
12.4.1|595|ROP Limitations
12.4.1.1|598|Exercises
12.4.2|599|Getting a Shell
12.4.2.1|600|Exercises
12.5|600|Wrapping Up
13|601|Trying Harder: The Labs
13.1|601|Challenge 1
13.2|601|Challenge 2
13.3|602|Challenge 3
13.4|604|Wrapping Up`;
export const sourceIndex=inventory.split('\n').map(line=>{const [section,page,title]=line.split('|');return {section,title,page:Number(page),chapter:Number(section.split('.')[0]),type:/exercis|extra mile/i.test(title)?'exercise':/Wrapping/i.test(title)||section==='1'||section.startsWith('1.')?'reference':'topic'};});
