#include "memory.h"

int main() {
    void* a = my_malloc(4000);
    void* b = my_malloc(100);

    my_free(b);
    my_free(a);

    /*my_free(b);

    void* c = my_malloc(20);

    void* d = my_malloc(24);

    my_free(a);
    my_free(c);

    void* e = my_malloc(15);

    my_free(b);
    my_free(d);
    my_free(e);

    print_ptr("[MAIN] &a: ", a);
    print_ptr("[MAIN] &b: ", b);
    print_ptr("[MAIN] &c: ", c);
    print_ptr("[MAIN] &d: ", d);
    print_ptr("[MAIN] &e: ", e); */
}