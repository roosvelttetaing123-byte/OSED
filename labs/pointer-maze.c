/* Original bounded memory exercise. Build as x86 to compare pointer sizes. */
#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
int main(int argc,char **argv){
    uint32_t seed=argc>1?(uint32_t)strtoul(argv[1],0,0):7;
    uint32_t values[8];unsigned i;
    for(i=0;i<8;i++)values[i]=seed+i*3;
    printf("pointer-size=%u bytes; element-size=%u bytes\n",(unsigned)sizeof(void*),(unsigned)sizeof(values[0]));
    for(i=0;i<8;i++)printf("element[%u] @ %p = %lu\n",i,(void*)&values[i],(unsigned long)values[i]);
    return values[4]==seed+12?0:1;
}
