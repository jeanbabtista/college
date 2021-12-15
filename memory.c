#include "memory.h"

#define print_h1(msg) printf("\n%s\n", msg);
#define print_num(msg, num) printf("\t-> %s: %d\n", msg, num)
#define print_ptr(msg, addr) printf("\t-> %s: %lu\n", msg, (long)addr % (10u * 10 * 10 * 10))

typedef enum { false, true } bool;

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
bool is_first_alloc = true;

void* my_malloc(const unsigned size_user_data) {
    printf("\n---------- MY MALLOC ---------");

    if (is_first_alloc) {
        is_first_alloc = false;

        // round size_total to multiple of getpagesize()
        const unsigned size_total = sizeof(alloc_info) + getpagesize() - sizeof(alloc_info) % getpagesize();

        // allocate memory
        ptr_alloc_info = (alloc_info*)mmap(NULL, size_total, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
        ptr_alloc_info->size_actual = sizeof(alloc_info);
        ptr_alloc_info->size_total = size_total;
        ptr_alloc_info->num_of_segments = 0;
        ptr_alloc_info->ptr_first_free_segment = ptr_alloc_info + 1;

        print_h1("alloc_info");
        print_ptr("address", ptr_alloc_info);
        print_num("actual size", ptr_alloc_info->size_actual);
        print_num("total size", ptr_alloc_info->size_total);
        print_num("number of segments", ptr_alloc_info->num_of_segments);
        print_ptr("first free segment", ptr_alloc_info->ptr_first_free_segment);
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

        print_h1("Reserved more space");
        print_h1("alloc_info");
        print_ptr("address", ptr_alloc_info);
        print_num("actual size", ptr_alloc_info->size_actual);
        print_num("total size", ptr_alloc_info->size_total);
        print_num("number of segments", ptr_alloc_info->num_of_segments);
        print_ptr("first free segment", ptr_alloc_info->ptr_first_free_segment);
    }

    // create new segment_info object
    segment_info* ptr_current_segment = (segment_info*)ptr_alloc_info->ptr_first_free_segment;
    ptr_current_segment->ptr_page = (void*)ptr_alloc_info;
    ptr_current_segment->size = size_user_data + sizeof(segment_info);

    print_h1("segment_info");
    print_ptr("address", ptr_current_segment);
    print_ptr("page ptr", ptr_current_segment->ptr_page);
    print_num("size", ptr_current_segment->size);

    // update alloc_info object
    ptr_alloc_info->num_of_segments++;
    ptr_alloc_info->size_actual += ptr_current_segment->size;
    ptr_alloc_info->ptr_first_free_segment += ptr_current_segment->size;

    print_h1("alloc_info");
    print_num("actual size", ptr_alloc_info->size_actual);
    print_num("number of segments", ptr_alloc_info->num_of_segments);
    print_ptr("first free segment", ptr_alloc_info->ptr_first_free_segment);

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
    print_h1("alloc_info");
    print_ptr("address", ptr_alloc_info);
    print_num("number of segments", ptr_alloc_info->num_of_segments);
    print_h1("segment_info");
    print_ptr("address", ptr_current_segment);

    // if no segments available, then deallocate memory
    if (!ptr_alloc_info->num_of_segments) {
        const int result = munmap((void*)ptr_alloc_info, ptr_alloc_info->size_total);
        if (result == -1)
            perror("munmap");

        // no dangling pointers
        ptr_alloc_info = NULL;

        print_h1("Memory unmapped");
        return;
    }
}
