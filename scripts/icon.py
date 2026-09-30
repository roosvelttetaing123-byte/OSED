"""Generate original geometric app icons with the Python standard library."""
import struct, zlib
from pathlib import Path
n=256
rows=[]
for y in range(n):
    row=bytearray([0])
    for x in range(n):
        color=(17,27,42,255)
        if 20<x<236 and 20<y<236: color=(28,46,67,255)
        if 65<x<93 and 58<y<199: color=(111,216,238,255)
        if 65<x<191 and 58<y<87: color=(111,216,238,255)
        if 65<x<165 and 116<y<143: color=(111,216,238,255)
        if 167<x<195 and 169<y<199: color=(248,188,119,255)
        row.extend(color)
    rows.append(row)
def chunk(tag,data):
    return struct.pack('!I',len(data))+tag+data+struct.pack('!I',zlib.crc32(tag+data)&0xffffffff)
png=b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('!2I5B',n,n,8,6,0,0,0))+chunk(b'IDAT',zlib.compress(b''.join(rows)))+chunk(b'IEND',b'')
p=Path(__file__).resolve().parents[1]/'src-tauri/icons';p.mkdir(exist_ok=True)
(p/'icon.png').write_bytes(png)
(p/'icon.ico').write_bytes(struct.pack('<3H',0,1,1)+struct.pack('<4B2H2I',0,0,0,0,1,32,len(png),22)+png)
