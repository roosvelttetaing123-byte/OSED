/* Original safe, local-only parser for source-visible then binary-only tracing. */
#include <stdio.h>
#include <string.h>
static int classify(const char *s){size_t n=strlen(s);if(n!=6)return 1;if(s[0]!='F'||s[1]!='G')return 2;if(s[2]<'0'||s[2]>'9')return 3;if(s[3]!=':')return 4;if(s[4]!=s[5])return 5;return 0;}
int main(int argc,char **argv){int result;if(argc>1&&strcmp(argv[1],"--self-test")==0)return classify("FG7:bb")||classify("bad")==0;
 if(argc!=2){puts("Usage: branch-hunter.exe <six-character record>");return 2;}
 result=classify(argv[1]);printf("parser-result=%d\n",result);return result;}
