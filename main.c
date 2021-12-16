#include "memory.h"

int main() {
    int* big_array = (int*)my_malloc(4400);
    print_ptr("&big array", big_array);
    my_free(big_array);

    /* const unsigned size = 10;
    int* a = (int*)my_malloc(size * sizeof(int));
    print_ptr("&a[]", a);

    char* b = (char*)my_malloc(size * sizeof(char));
    print_ptr("&b[]", b);

    int* c = (int*)my_malloc(size * sizeof(int));
    print_ptr("&c[]", c);

    my_free(c);
    my_free(b);
    my_free(a);



    /* const unsigned new_size = 1100;
    int* big_array_1 = (int*)my_malloc(new_size * sizeof(int));
    print_ptr("&big_array_1[]", big_array_1);

    int* big_array_2 = (int*)my_malloc(new_size * sizeof(int));
    // print_ptr("&big_array_2[]", big_array_2); */

    /* my_free(new_array);
    my_free(array);
    my_free(abc);
    my_free(_array);

    // init
    for (unsigned i = 0; i < size; i++)
        array[i] = i + 65;
    for (unsigned i = 0; i < size; i++)
        abc[i] = i + 'A';

    // print
    printf("Array: ");
    for (unsigned i = 0; i < size; i++)
        printf("%d ", array[i]);
    printf("\n");

    printf("Alphabet: ");
    for (unsigned i = 0; i < size; i++)
        printf("%c ", abc[i]);
    printf("\n"); */
}