/* Original bounded x86 observation lab. No network listener, payload or unbounded copy.
 * Build with the supplied x86 build.cmd; keep the matching PDB beside the executable.
 * In WinDbg: bu lesson_lab!checkpoint ; g. Modes: memory, call, copy, branch, seh.
 */
#include <windows.h>
#include <stdio.h>
#include <stdint.h>
#include <string.h>
typedef struct TUTOR_RECORD { uint32_t marker; uint32_t count; uint32_t *pointer; } TUTOR_RECORD;
volatile unsigned char tutor_bytes[8] = {0x12,0x34,0x56,0x78,0x00,0x41,0x42,0x43};
uint32_t tutor_words[4] = {7,19,31,43};
TUTOR_RECORD tutor_record = {0x31415926,4,tutor_words};
volatile uint32_t tutor_result=0;
volatile uint32_t tutor_phase=0;
char tutor_destination[8]={0};
__declspec(noinline) void checkpoint(void) { tutor_phase += 1; }
__declspec(noinline) uint32_t tutor_add(uint32_t left,uint32_t right) { uint32_t result=left+right; return result; }
__declspec(noinline) int tutor_copy(const unsigned char *source,size_t count) {
    if(count>sizeof(tutor_destination)) return 0;
    memcpy(tutor_destination,source,count);
    return 1;
}
__declspec(noinline) int tutor_dispatch(uint32_t length,unsigned char tag) {
    if(length>=4 && tag==0x46) return 1;
    return 0;
}
__declspec(noinline) int tutor_exception(void) {
    int handled=0;
    __try { RaiseException(0xE0424242,0,0,NULL); }
    __except(EXCEPTION_EXECUTE_HANDLER) { handled=1; }
    return handled;
}
int main(int argc,char **argv) {
    const char *mode=argc>1?argv[1]:"memory";
    if(sizeof(void*)!=4) { fprintf(stderr,"This lab must be built as x86 (32-bit).\n");return 2; }
    if(strcmp(mode,"memory")==0) {
        checkpoint();
        printf("pointer_bytes=%u first_word=%u phase=%u\n",(unsigned)sizeof(void*),tutor_words[0],tutor_phase);
    } else if(strcmp(mode,"call")==0) {
        tutor_result=tutor_add(3,9);checkpoint();
        printf("result=%u\n",tutor_result);if(tutor_result!=12)return 3;
    } else if(strcmp(mode,"copy")==0) {
        int accepted_copy=tutor_copy((const unsigned char*)"ABCDEFG",7);
        int rejected=tutor_copy((const unsigned char*)"ABCDEFGHI",9);
        tutor_result=(uint32_t)(accepted_copy==1 && rejected==0);checkpoint();
        printf("small=%d oversized_accepted=%d result=%u\n",accepted_copy,rejected,tutor_result);
        if(!tutor_result)return 4;
    } else if(strcmp(mode,"branch")==0) {
        tutor_result=(uint32_t)tutor_dispatch(3,0x46);checkpoint();
        printf("length_3_result=%u\n",tutor_result);if(tutor_result!=0)return 5;
        tutor_result=(uint32_t)tutor_dispatch(4,0x46);checkpoint();
        printf("length_4_result=%u\n",tutor_result);if(tutor_result!=1)return 6;
    } else if(strcmp(mode,"seh")==0) {
        tutor_result=(uint32_t)tutor_exception();checkpoint();
        printf("exception_handled=%u\n",tutor_result);if(tutor_result!=1)return 7;
    } else {fprintf(stderr,"Mode: memory | call | copy | branch | seh\n");return 1;}
    return 0;
}
