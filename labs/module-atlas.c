/* Observe module-relative addresses and actual page protection. No settings changed. */
#include <windows.h>
#include <stdio.h>
int main(void){HMODULE base=GetModuleHandleW(NULL);MEMORY_BASIC_INFORMATION m;SIZE_T n=VirtualQuery((LPCVOID)base,&m,sizeof(m));
 if(!base||!n)return 1;
 printf("image-base=%p main=%p RVA=0x%lX page-protection=0x%lX pointer-size=%u\n",(void*)base,(void*)main,(unsigned long)((ULONG_PTR)main-(ULONG_PTR)base),(unsigned long)m.Protect,(unsigned)sizeof(void*));return 0;}
