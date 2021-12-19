#include "memory.h"

int main() {
    int* a = (int*)my_malloc(4 * sizeof(int));
    print_ptr("[MAIN] &a: ", a);
    int* b = (int*)my_malloc(4 * sizeof(int));
    print_ptr("[MAIN] &b: ", b);
    int* c = (int*)my_malloc(4 * sizeof(int));
    print_ptr("[MAIN] &c: ", c);

    int* d = (int*)my_malloc(4400);
    print_ptr("[MAIN] &d: ", d);
    int* e = (int*)my_malloc(12 * sizeof(int));
    print_ptr("[MAIN] &e: ", e);

    int* f = (int*)my_malloc(4400);
    print_ptr("[MAIN] &f: ", f);

    my_free(a);
    my_free(b);
    my_free(c);
    my_free(d);
    my_free(e);
    my_free(f);

}