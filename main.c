#include "memory.h"

int main() {
    int* a = (int*)my_malloc(4 * sizeof(int));
    print_ptr("&a", a);
    int* b = (int*)my_malloc(4 * sizeof(int));
    print_ptr("&b", b);
    int* c = (int*)my_malloc(4 * sizeof(int));
    print_ptr("&c", c);
    my_free(a);
    my_free(b);
    my_free(c);

    int* d = (int*)my_malloc(4400);
    print_ptr("&d", d);
    int* e = (int*)my_malloc(12 * sizeof(int));
    print_ptr("&e", e);
    my_free(d);
    my_free(e);

    int* f = (int*)my_malloc(4400);
    print_ptr("&f", f);
    my_free(f);

}