#include "mymalloc.h"

int main() {
    const unsigned size = 100;

    void* a = mymalloc(size);
    void* b = mymalloc(size);
    print_ptr("[MAIN] &a: ", a);
    print_ptr("[MAIN] &b: ", b);

    myfree(a);

    void* c = mymalloc(40);
    print_ptr("[MAIN] &c: ", c);

    void* d = mymalloc(40);
    print_ptr("[MAIN] &d: ", d);

    void* e = mymalloc(30);
    print_ptr("[MAIN] &e: ", e);

    myfree(b);
    myfree(c);
    myfree(d);
    myfree(e);
}