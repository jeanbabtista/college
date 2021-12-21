#include "mymalloc.h"

int main() {
    const unsigned size = 100;

    void* a = my_malloc(size);
    void* b = my_malloc(size);
    print_ptr("[MAIN] &a: ", a);
    print_ptr("[MAIN] &b: ", b);

    my_free(a);

    void* c = my_malloc(40);
    print_ptr("[MAIN] &c: ", c);

    void* d = my_malloc(40);
    print_ptr("[MAIN] &d: ", d);

    void* e = my_malloc(30);
    print_ptr("[MAIN] &e: ", e);

    my_free(b);
    my_free(c);
    my_free(d);
    my_free(e);
}