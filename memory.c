#include "memory.h"

struct alloc_info {
    unsigned size_actual;
    unsigned size_total;
    unsigned num_of_segments;
    void* ptr_first_free_segment;
} typedef alloc_info;

struct segment_info {
    unsigned size;
    void* ptr_page;
} typedef segment_info;

alloc_info* ptr_alloc_info;
static int is_first_alloc = 1;

void* my_malloc(const unsigned size) {
    // config
    const unsigned size_data = size;
    const unsigned size_alloc_info = sizeof(alloc_info);
    const unsigned size_segment_info = sizeof(segment_info);
    const unsigned size_page = getpagesize();

    printf("config:\n");
    printf("\t-> data size: %d\n", size);
    printf("\t-> sizeof(alloc_info): %d\n", size_alloc_info);
    printf("\t-> sizeof(segment_info): %d\n", size_segment_info);
    printf("\t-> page size: %d\n", size_page);

    if (is_first_alloc) {
        is_first_alloc = 0;

        // round size_total to multiple of size_page
        const unsigned size_actual = /* size_data + */ size_alloc_info;
        const unsigned size_total = size_actual + size_page - size_actual % size_page;

        // allocate memory
        ptr_alloc_info = (alloc_info*)mmap(NULL, size_total, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
        ptr_alloc_info->size_actual = size_actual;
        ptr_alloc_info->size_total = size_total;
        ptr_alloc_info->num_of_segments = 0;
        ptr_alloc_info->ptr_first_free_segment = ptr_alloc_info + 1;

        printf("\nalloc_info:\n");
        printf("\t-> address: %lu\n", (long)ptr_alloc_info);
        printf("\t-> actual size: %d\n", ptr_alloc_info->size_actual);
        printf("\t-> total size: %d\n", ptr_alloc_info->size_total);
        printf("\t-> number of segments: %d\n", ptr_alloc_info->num_of_segments);
        printf("\t-> first free segment: %lu\n", (long)ptr_alloc_info->ptr_first_free_segment);
    }

    // create new segment_info object
    segment_info* ptr_current_segment = (segment_info*)ptr_alloc_info->ptr_first_free_segment;
    ptr_current_segment->ptr_page = (void*)ptr_alloc_info;
    ptr_current_segment->size = size_data + size_segment_info;

    printf("\nsegment_info:\n");
    printf("\t-> address: %lu\n", (long)ptr_current_segment);
    printf("\t-> page ptr: %lu\n", (long)ptr_current_segment->ptr_page);
    printf("\t-> size: %d\n", ptr_current_segment->size);

    // update alloc_info object
    ptr_alloc_info->num_of_segments++;
    ptr_alloc_info->size_actual += ptr_current_segment->size;
    ptr_alloc_info->ptr_first_free_segment += ptr_current_segment->size;

    printf("\nalloc_info:\n");
    printf("\t-> address: %lu\n", (long)ptr_alloc_info);
    printf("\t-> actual size: %d\n", ptr_alloc_info->size_actual);
    printf("\t-> total size: %d\n", ptr_alloc_info->size_total);
    printf("\t-> number of segments: %d\n", ptr_alloc_info->num_of_segments);
    printf("\t-> first free segment: %lu\n", (long)ptr_alloc_info->ptr_first_free_segment);

    // return [ address of info ] + [ size of info ]
    return (void*)ptr_alloc_info;
}

void my_free(void* ptr_memory) {
    // config
    const unsigned size_alloc_info = sizeof(alloc_info);
    void* ptr_data = ptr_memory - size_alloc_info;
    alloc_info* ptr_alloc_info = (alloc_info*)ptr_data;
    const unsigned size_data = ptr_alloc_info->size_total;

    /* printf("\n-------- MY FREE --------\n");
    printf("Memory address: %p\n", ptr_memory);
    printf("Subtracted pointer address: %p\n", ptr_alloc_info);
    printf("alloc_info->size_actual: %d\n", ptr_alloc_info->size_actual);
    printf("alloc_info->size_total: %d\n", ptr_alloc_info->size_total); */

    // deallocate memory
    const int result = munmap(ptr_data, size_data);
    if (result == -1)
        perror("munmap");

    // no dangling pointers
    ptr_data = NULL;
}