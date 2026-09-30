/* Original calling-convention exercise. Debug x86 build, not the x64 host app. */
#include <stdio.h>
#ifdef _MSC_VER
#define NOINLINE __declspec(noinline)
#define CDECL __cdecl
#define STDCALL __stdcall
#else
#define NOINLINE __attribute__((noinline))
#define CDECL
#define STDCALL
#endif
NOINLINE int CDECL add_caller(int a,int b){volatile int out=a+b;return out;}
NOINLINE int STDCALL add_callee(int a,int b){volatile int out=a+b;return out;}
int main(void){volatile int first=add_caller(11,17);volatile int second=add_callee(first,9);printf("first=%d second=%d\n",first,second);return second==37?0:1;}
