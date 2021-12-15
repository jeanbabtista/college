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

void* my_malloc(const unsigned size_user_data) {
    printf("\n---------- MY MALLOC ---------");

    if (is_first_alloc) {
        is_first_alloc = 0;

        // round size_total to multiple of getpagesize()
        const unsigned size_total = sizeof(alloc_info) + getpagesize() - sizeof(alloc_info) % getpagesize();

        // allocate memory
        ptr_alloc_info = (alloc_info*)mmap(NULL, size_total, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
        ptr_alloc_info->size_actual = sizeof(alloc_info);
        ptr_alloc_info->size_total = size_total;
        ptr_alloc_info->num_of_segments = 0;
        ptr_alloc_info->ptr_first_free_segment = ptr_alloc_info + 1;

        printf("\nalloc_info:\n");
        printf("\t-> address: %lu\n", (long)ptr_alloc_info % (10u * 10 * 10 * 10));
        printf("\t-> actual size: %d\n", ptr_alloc_info->size_actual);
        printf("\t-> total size: %d\n", ptr_alloc_info->size_total);
        printf("\t-> number of segments: %d\n", ptr_alloc_info->num_of_segments);
        printf("\t-> first free segment: %lu\n", (long)ptr_alloc_info->ptr_first_free_segment % (10u * 10 * 10 * 10));
    }

    // if no space is available at current page for new segment, map new memory
    const int space_left = ptr_alloc_info->size_total - ptr_alloc_info->size_actual - size_user_data - sizeof(segment_info);
    printf("\nSpace left: %d\n", space_left);
    if (space_left <= 0) {
        // round size_total to multiple of getpagesize()
        const unsigned size_total = size_user_data + sizeof(alloc_info) + getpagesize() - (size_user_data + sizeof(alloc_info)) % getpagesize();

        // allocate memory
        ptr_alloc_info = (alloc_info*)mmap(NULL, size_total, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
        ptr_alloc_info->size_actual = sizeof(alloc_info);
        ptr_alloc_info->size_total = size_total;
        ptr_alloc_info->num_of_segments = 0;
        ptr_alloc_info->ptr_first_free_segment = ptr_alloc_info + 1;

        printf("\nReserved more space:");
        printf("\nalloc_info:\n");
        printf("\t-> address: %lu\n", (long)ptr_alloc_info % (10u * 10 * 10 * 10));
        printf("\t-> actual size: %d\n", ptr_alloc_info->size_actual);
        printf("\t-> total size: %d\n", ptr_alloc_info->size_total);
        printf("\t-> number of segments: %d\n", ptr_alloc_info->num_of_segments);
        printf("\t-> first free segment: %lu\n", (long)ptr_alloc_info->ptr_first_free_segment % (10u * 10 * 10 * 10));

    }

    // create new segment_info object
    segment_info* ptr_current_segment = (segment_info*)ptr_alloc_info->ptr_first_free_segment;
    ptr_current_segment->ptr_page = (void*)ptr_alloc_info;
    ptr_current_segment->size = size_user_data + sizeof(segment_info);

    printf("\nsegment_info:\n");
    printf("\t-> address: %lu\n", (long)ptr_current_segment % (10u * 10 * 10 * 10));
    printf("\t-> page ptr: %lu\n", (long)ptr_current_segment->ptr_page % (10u * 10 * 10 * 10));
    printf("\t-> size: %d\n", ptr_current_segment->size);

    // update alloc_info object
    ptr_alloc_info->num_of_segments++;
    ptr_alloc_info->size_actual += ptr_current_segment->size;
    ptr_alloc_info->ptr_first_free_segment += ptr_current_segment->size;

    printf("\nalloc_info:\n");
    printf("\t-> actual size: %d\n", ptr_alloc_info->size_actual);
    printf("\t-> number of segments: %d\n", ptr_alloc_info->num_of_segments);
    printf("\t-> first free segment: %lu\n", (long)ptr_alloc_info->ptr_first_free_segment % (10u * 10 * 10 * 10));

    // return [ address of segment ] + [ size of segment ]
    return (void*)ptr_current_segment + sizeof(segment_info);
}

void my_free(void* ptr_memory) {
    // config
    void* ptr_data = ptr_memory - sizeof(segment_info);
    segment_info* ptr_current_segment = (segment_info*)ptr_data;
    alloc_info* ptr_alloc_info = (alloc_info*)ptr_current_segment->ptr_page;

    // decrement number of segments, do not delete anything explicitly yet
    ptr_alloc_info->num_of_segments--;

    printf("\n---------- MY FREE ---------");
    printf("\nalloc_info:\n");
    printf("\t-> address: %lu\n", (long)ptr_alloc_info % (10u * 10 * 10 * 10));
    printf("\t-> number of segments: %d\n", ptr_alloc_info->num_of_segments);
    printf("\nsegment_info:\n");
    printf("\t-> address: %lu\n", (long)ptr_current_segment % (10u * 10 * 10 * 10));

    // if no segments available, then deallocate memory
    if (!ptr_alloc_info->num_of_segments) {
        const int result = munmap((void*)ptr_alloc_info, ptr_alloc_info->size_total);
        if (result == -1)
            perror("munmap");

        // no dangling pointers
        ptr_alloc_info = NULL;

        printf("Memory unmapped.\n");
        return;
    }
}