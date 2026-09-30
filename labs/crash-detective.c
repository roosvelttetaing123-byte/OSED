/* Deliberate local crash, only behind an explicit --crash flag. Use a disposable VM. */
#include <stdio.h>
#include <string.h>
#ifdef _MSC_VER
#define NOINLINE __declspec(noinline)
#else
#define NOINLINE __attribute__((noinline))
#endif
NOINLINE int inspect_slot(unsigned slot){int value=73;volatile int *selected=0;if(slot<3)selected=&value;return *selected;}
int main(int argc,char **argv){
 if(argc>1&&strcmp(argv[1],"--self-test")==0)return inspect_slot(1)==73?0:1;
 if(argc!=2||strcmp(argv[1],"--crash")!=0){puts("Use --self-test for a safe check. --crash deliberately faults; run only in a lab VM.");return 0;}
 printf("Read result: %d\n",inspect_slot(3));return 0;
}
