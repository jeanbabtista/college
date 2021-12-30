#include "mymalloc.h"

void case_one(), case_many(), case_many_alloc_only(), vaje_um_test();

int main() {
    case_one();
    case_many();
    case_many_alloc_only();
    vaje_um_test();
}

/* only one alloc_info block demonstrated */
void case_one() {
    // creates new alloc_info block and segment 'a' of size 4096
    void* a = mymalloc(100);

    // deletes segment 'a' and alloc_info block
    myfree(a);

    // creates new alloc_info block and segment 'b' of size 4096
    void* b = mymalloc(40);

    // no space between alloc_info block and segment 'a', add new segment 'c' to the end
    void* c = mymalloc(30);

    // deletes first segment, now 72 (40 for data, 32 for segment_inf block)
    // bytes of space between alloc_info block and segment 'a'
    myfree(b);

    // needs 30 + 32 = 62 bytes of space, inserted before segment 'c'
    // now 10 bytes of space between segment 'b' and 'c' 
    void* d = mymalloc(30);

    // 10 + 32 = 42 bytes of space, no space, add segment 'e' to the end
    void* e = mymalloc(10);

    myfree(d);
    myfree(e);
    myfree(c);
}

/* multiple alloc_info blocks demonstrated */
void case_many() {
    // creates new alloc_info block and segment 'a' of size 8192
    // segments stack: a
    // printf("Creating segment 'a'\n");
    void* a = mymalloc(4100);

    // add to end
    // segments stack: a b
    // printf("Creating segment 'b'\n");
    void* b = mymalloc(1000);

    // remove segment 'a', only 'b' left
    // segments stack: b
    myfree(a);

    // inserts segment 'c' between alloc_info block and segment 'b'
    // segments stack: c b
    // printf("Creating segment 'c'\n");
    void* c = mymalloc(500);

    // creates new alloc_info block and segment 'd' of size 4096
    // segments 1 stack: c b
    // segments 2 stack: d
    // printf("Creating segment 'd'\n");
    void* d = mymalloc(3700);

    // insert new segment 'e' to first alloc_info between segments 'c' and 'b'
    // segments 1 stack: c e b
    // segments 2 stack: d
    // printf("Creating segment 'e'\n");
    void* e = mymalloc(2000);

    // no space anywhere, creates new alloc_info block and segment 'f'
    // segments 1 stack: c e b
    // segments 2 stack: d
    // segments 3 stack: f
    // printf("Creating segment 'f'\n");
    void* f = mymalloc(3000);

    myfree(f);
    myfree(e);
    myfree(d);
    myfree(c);
    myfree(a);
}

void case_many_alloc_only() {
    // printf("Creating segment 'a'\n");
    void* a = mymalloc(4100);

    // printf("Creating segment 'b'\n");
    void* b = mymalloc(4100);

    // printf("Creating segment 'c'\n");
    void* c = mymalloc(4100);

    // printf("Creating segment 'd'\n");
    void* d = mymalloc(4100);

    myfree(d);
    myfree(a);
    myfree(c);
    myfree(b);
}

void vaje_um_test() {
    void* a1 = mymalloc(120);
    void* a2 = mymalloc(10);
    void* a3 = mymalloc(120);
    void* a4 = mymalloc(120);
    void* a5 = mymalloc(500);
    void* a6 = mymalloc(120);
    void* a7 = mymalloc(10);

    myfree(a2);
    myfree(a3);
    myfree(a1);
    myfree(a4);

    void* a8 = mymalloc(10);

    myfree(a6);
    myfree(a7);

    void* a9 = mymalloc(120);
    void* a10 = mymalloc(500);
    void* a11 = mymalloc(1324);

    myfree(a5);

    void* a12 = mymalloc(1324);
    void* a13 = mymalloc(1324);
    void* a14 = mymalloc(120);
    void* a15 = mymalloc(1324);

    myfree(a8);

    myfree(a9);
    myfree(a10);
    myfree(a11);
    myfree(a12);
    myfree(a13);
    myfree(a14);
    myfree(a15);
}
