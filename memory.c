#include "memory.h"

typedef enum { false, true } bool;

#define DEBUG false

struct segment_info {
    unsigned size;
    void* ptr_page;
    struct segment_info
        * ptr_prev,
        * ptr_next;
} typedef segment_info;

struct alloc_info {
    unsigned
        size_actual,
        size_total,
        num_of_segments;
    void* ptr_first_free_segment;
    segment_info
        * ptr_head_segment_info,
        * ptr_tail_segment_info;
    struct alloc_info
        * ptr_prev,
        * ptr_next;
} typedef alloc_info;

// globals
alloc_info
* g_ptr_alloc_info,
* g_ptr_head_alloc_info,
* g_ptr_tail_alloc_info;

bool is_first_alloc = true;

void* my_malloc(const unsigned size_user_data) {
    printf("\n---------- MY MALLOC ---------");

    // create alloc_info object
    if (is_first_alloc) {
        is_first_alloc = false;

        // round size_total to multiple of getpagesize()
        const unsigned size_total = sizeof(alloc_info) + getpagesize() - sizeof(alloc_info) % getpagesize();

        // allocate memory
        g_ptr_alloc_info = (alloc_info*)mmap(NULL, size_total, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
        g_ptr_alloc_info->size_actual = sizeof(alloc_info);
        g_ptr_alloc_info->size_total = size_total;
        g_ptr_alloc_info->num_of_segments = 0;
        g_ptr_alloc_info->ptr_first_free_segment = g_ptr_alloc_info + 1;

        // set linked list pointers
        g_ptr_alloc_info->ptr_head_segment_info = g_ptr_alloc_info->ptr_tail_segment_info = NULL;
        g_ptr_alloc_info->ptr_prev = g_ptr_alloc_info->ptr_next = NULL;

        // set head and tail of linked list
        g_ptr_head_alloc_info = g_ptr_tail_alloc_info = g_ptr_alloc_info;

        if (DEBUG) {
            print_h1("alloc_info");
            print_ptr("address", g_ptr_alloc_info);
            print_num("actual size", g_ptr_alloc_info->size_actual);
            print_num("total size", g_ptr_alloc_info->size_total);
            print_num("number of segments", g_ptr_alloc_info->num_of_segments);
            print_ptr("first free segment", g_ptr_alloc_info->ptr_first_free_segment);
        }
    }

    // if no space is available at current page for new segment, create new alloc_info object
    const int space_left = g_ptr_alloc_info->size_total - g_ptr_alloc_info->size_actual - size_user_data - sizeof(segment_info);

    if (DEBUG)
        printf("\nSpace left: %d\n", space_left);

    if (space_left <= 0) {
        // round size_total to multiple of getpagesize()
        const unsigned size_total = size_user_data + sizeof(alloc_info) + getpagesize() - (size_user_data + sizeof(alloc_info)) % getpagesize();

        // allocate memory
        g_ptr_alloc_info = (alloc_info*)mmap(NULL, size_total, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
        g_ptr_alloc_info->size_actual = sizeof(alloc_info);
        g_ptr_alloc_info->size_total = size_total;
        g_ptr_alloc_info->num_of_segments = 0;
        g_ptr_alloc_info->ptr_first_free_segment = g_ptr_alloc_info + 1;

        // set linked list pointers        
        g_ptr_alloc_info->ptr_prev = g_ptr_tail_alloc_info;
        g_ptr_alloc_info->ptr_next = NULL;
        g_ptr_tail_alloc_info->ptr_next = g_ptr_alloc_info;
        g_ptr_tail_alloc_info = g_ptr_alloc_info;

        if (DEBUG) {
            print_h1("Reserved more space");
            print_h1("alloc_info");
            print_ptr("address", g_ptr_alloc_info);
            print_num("actual size", g_ptr_alloc_info->size_actual);
            print_num("total size", g_ptr_alloc_info->size_total);
            print_num("number of segments", g_ptr_alloc_info->num_of_segments);
            print_ptr("first free segment", g_ptr_alloc_info->ptr_first_free_segment);
            print_ptr("prev alloc_info", g_ptr_alloc_info->ptr_prev);
            print_ptr("next alloc_info", g_ptr_alloc_info->ptr_next);
        }
    }

    // create segment info
    segment_info* ptr_current_segment = (segment_info*)g_ptr_alloc_info->ptr_first_free_segment;
    ptr_current_segment->size = size_user_data + sizeof(segment_info);
    ptr_current_segment->ptr_page = (void*)g_ptr_alloc_info;

    // set linked list pointers
    if (!g_ptr_alloc_info->num_of_segments) {
        ptr_current_segment->ptr_prev = ptr_current_segment->ptr_next = NULL;
        g_ptr_alloc_info->ptr_head_segment_info = g_ptr_alloc_info->ptr_tail_segment_info = ptr_current_segment;
    }
    else {
        ptr_current_segment->ptr_prev = g_ptr_alloc_info->ptr_tail_segment_info;
        ptr_current_segment->ptr_next = NULL;
        g_ptr_alloc_info->ptr_tail_segment_info->ptr_next = ptr_current_segment;
        g_ptr_alloc_info->ptr_tail_segment_info = ptr_current_segment;
    }

    // update alloc_info object
    g_ptr_alloc_info->num_of_segments++;
    g_ptr_alloc_info->size_actual += ptr_current_segment->size;
    g_ptr_alloc_info->ptr_first_free_segment += ptr_current_segment->size;

    if (DEBUG) {
        print_h1("segment_info");
        print_ptr("address", ptr_current_segment);
        print_ptr("page ptr", ptr_current_segment->ptr_page);
        print_ptr("ptr_prev", ptr_current_segment->ptr_prev);
        print_ptr("ptr_next", ptr_current_segment->ptr_next);
        print_num("size", ptr_current_segment->size);

        print_h1("alloc_info");
        print_num("actual size", g_ptr_alloc_info->size_actual);
        print_num("number of segments", g_ptr_alloc_info->num_of_segments);
        print_ptr("first free segment", g_ptr_alloc_info->ptr_first_free_segment);
        print_ptr("head segment", g_ptr_alloc_info->ptr_head_segment_info);
        print_ptr("tail segment", g_ptr_alloc_info->ptr_tail_segment_info);
    }

    if (!DEBUG) {
        print_h1("Printing segment_info list");
        {
            segment_info* temp = g_ptr_alloc_info->ptr_head_segment_info;
            while (temp) {
                print_num("size", (int)(temp->size - sizeof(segment_info)));
                print_ptr("address", temp);
                print_ptr("prev", temp->ptr_prev);
                print_ptr("next", temp->ptr_next);
                printf("\n");

                temp = temp->ptr_next;
            }
        }

        print_h1("Printing alloc_info list");
        {
            alloc_info* temp = g_ptr_head_alloc_info;
            while (temp) {
                print_ptr("address", temp);
                print_ptr("prev", temp->ptr_prev);
                print_ptr("next", temp->ptr_next);
                printf("\n");

                temp = temp->ptr_next;
            }
        }
    }

    // return [ address of segment ] + [ size of segment ]
    return (void*)ptr_current_segment + sizeof(segment_info);
}

void my_free(void* ptr_memory) {
    // config
    void* ptr_data = ptr_memory - sizeof(segment_info);
    segment_info* ptr_current_segment = (segment_info*)ptr_data;
    alloc_info* g_ptr_alloc_info = (alloc_info*)ptr_current_segment->ptr_page;

    // decrement number of segments, do not delete anything explicitly yet
    g_ptr_alloc_info->num_of_segments--;

    printf("\n---------- MY FREE ---------");
    print_h1("alloc_info");
    print_ptr("address", g_ptr_alloc_info);
    print_num("number of segments", g_ptr_alloc_info->num_of_segments);
    print_h1("segment_info");
    print_ptr("address", ptr_current_segment);

    // if no segments available, then deallocate memory
    if (!g_ptr_alloc_info->num_of_segments) {
        const int result = munmap((void*)g_ptr_alloc_info, g_ptr_alloc_info->size_total);
        if (result == -1)
            perror("munmap");

        // no dangling pointers
        g_ptr_alloc_info = NULL;

        print_h1("Memory unmapped");
        return;
    }
}
