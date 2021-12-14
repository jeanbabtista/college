#include "memory.h"

int main() {
    const unsigned size = 10;
    int* array = (int*)my_malloc(size * sizeof(int));

    // init array
    for (unsigned i = 0; i < size; i++)
        array[i] = i + 65;

    // print array
    printf("Array: ");
    for (unsigned i = 0; i < size; i++)
        printf("%d ", i);
    printf("\n");

    my_free(array);
}