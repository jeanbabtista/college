#include "memory.h"

int main() {
    void* a = my_malloc(12);
    void* b = my_malloc(16);
    void* c = my_malloc(20);
    void* d = my_malloc(24);

    print_ptr("[MAIN] &a: ", a);
    print_ptr("[MAIN] &b: ", b);
    print_ptr("[MAIN] &c: ", c);
    print_ptr("[MAIN] &d: ", d);

    my_free(a);
    my_free(c);

    void* e = my_malloc(15);
    print_ptr("[MAIN] &e: ", e);

    my_free(b);
    my_free(d);
    my_free(e);
}