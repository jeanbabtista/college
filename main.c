#include "memory.h"

int main() {
    const unsigned size = 10;
    int* array = (int*)my_malloc(size * sizeof(int));
    char* abc = (char*)my_malloc(size * sizeof(char));

    /* // init
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
    printf("\n");

    my_free(array);
    my_free(abc); */
}