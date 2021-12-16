#include "memory.h"

int main() {
    const unsigned size = 10;
    int* array = (int*)my_malloc(size * sizeof(int));
    print_ptr("&array[]", array);

    char* abc = (char*)my_malloc(size * sizeof(char));
    print_ptr("&char[]", abc);

    int* _array = (int*)my_malloc(size * sizeof(int));
    print_ptr("&_array[]", _array);

    /* const unsigned new_size = 1100;
    int* new_array = (int*)my_malloc(new_size * sizeof(int));
    printf("\n&new array: %lu\n", (long)new_array % (10u * 10 * 10 * 10));

    my_free(new_array);
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