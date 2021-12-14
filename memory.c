#include "memory.h"

struct alloc_info {
    unsigned size_total;
    unsigned size_actual;
    unsigned num_of_segments;
    void* ptr_first_free_segment;
} typedef alloc_info;

struct segment_info {
    unsigned size;
    void* ptr_page;
} typedef segment_info;

void* my_malloc(const unsigned size) {
    // config
    const unsigned size_mmap = size;
    const unsigned size_info = sizeof(alloc_info);
    const unsigned size_actual = size_mmap + size_info;
    const int size_page = getpagesize();

    // get size over the page limit
    // round size_total to multiple of size_page
    const int size_over = size_actual % size_page;
    const unsigned size_total = size_actual + size_page - size_over;

    // allocate memory
    alloc_info* info = (alloc_info*)mmap(NULL, size_total, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    info->size_actual = size_actual;
    info->size_total = size_total;

    // return [ address of info ] + [ size of info ]
    void* ptr_memory = (void*)info + size_info;

    /* printf("\n-------- MY MALLOC --------\n");
    printf("Actual size: %d\n", info->size_actual);
    printf("Allocated size: %d.\n", info->size_total);
    printf("Total data address: %p\n", info);
    printf("Actual data address: %p\n", ptr_memory); */

    return ptr_memory;
}

void my_free(void* ptr_memory) {
    // config
    const unsigned size_info = sizeof(alloc_info);
    void* ptr_data = ptr_memory - size_info;
    alloc_info* ptr_info = (alloc_info*)ptr_data;
    const unsigned size_data = ptr_info->size_total;

    /* printf("\n-------- MY FREE --------\n");
    printf("Memory address: %p\n", ptr_memory);
    printf("Subtracted pointer address: %p\n", ptr_info);
    printf("alloc_info->size_actual: %d\n", ptr_info->size_actual);
    printf("alloc_info->size_total: %d\n", ptr_info->size_total); */

    // deallocate memory
    const int result = munmap(ptr_data, size_data);
    if (result == -1)
        perror("munmap");

    // no dangling pointers
    ptr_data = NULL;
}