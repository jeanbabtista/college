#include "memory.h"

typedef enum { false, true } bool;

#define DEBUG true

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
        size_total;
    void* ptr_first_free_segment;

    segment_info
        * ptr_head_segment_info,
        * ptr_tail_segment_info;

    struct alloc_info
        * ptr_prev,
        * ptr_next;
} typedef alloc_info;

// globals
alloc_info* g_ptr_head_alloc_info = NULL;
alloc_info* g_ptr_tail_alloc_info = NULL;

unsigned get_size_rounded(unsigned size_user_data) {
    unsigned size = size_user_data + sizeof(alloc_info) + sizeof(segment_info);
    for (unsigned i = 1; i < INT_MAX; i++)
        if (size > (i - 1) * getpagesize() && size <= i * getpagesize())
            return i * getpagesize();
    return 0;
}

void* my_malloc(const unsigned size_user_data) {
    print_h1("---------- MY MALLOC ---------");
    alloc_info* ptr_alloc_info;

    // create alloc_info object
    if (!g_ptr_head_alloc_info && !g_ptr_tail_alloc_info) {
        // round size_total to multiple of getpagesize()
        const unsigned size_total = get_size_rounded(size_user_data);

        // allocate memory
        printf("allocating %u bytes ...", size_total);
        ptr_alloc_info = (alloc_info*)mmap(NULL, size_total, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
        ptr_alloc_info->size_actual = sizeof(alloc_info);
        ptr_alloc_info->size_total = size_total;
        ptr_alloc_info->ptr_first_free_segment = ptr_alloc_info + 1;

        // set linked list pointers
        ptr_alloc_info->ptr_head_segment_info = ptr_alloc_info->ptr_tail_segment_info = NULL;
        ptr_alloc_info->ptr_prev = ptr_alloc_info->ptr_next = NULL;

        // set head and tail of linked list
        g_ptr_head_alloc_info = g_ptr_tail_alloc_info = ptr_alloc_info;

        if (DEBUG) {
            print_h1("Initializing alloc_info");
            print_ptr("address", ptr_alloc_info);
            print_num("actual size", ptr_alloc_info->size_actual);
            print_num("total size", ptr_alloc_info->size_total);
            print_ptr("first free segment", ptr_alloc_info->ptr_first_free_segment);
        }
    }

    // if no space is available at current page for new segment, create new alloc_info object
    const int space_left = ptr_alloc_info->size_total - ptr_alloc_info->size_actual - size_user_data - sizeof(alloc_info) - sizeof(segment_info);

    if (DEBUG)
        print_num("Space left", space_left);

    if (space_left <= 0) {
        // round size_total to multiple of getpagesize()
        const unsigned size_total = size_user_data + sizeof(alloc_info) + getpagesize() - (size_user_data + sizeof(alloc_info)) % getpagesize();

        // allocate memory
        printf("allocating additional %u bytes ...", size_total);
        ptr_alloc_info = (alloc_info*)mmap(NULL, size_total, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
        ptr_alloc_info->size_actual = sizeof(alloc_info);
        ptr_alloc_info->size_total = size_total;
        ptr_alloc_info->ptr_first_free_segment = ptr_alloc_info + 1;

        // set global linked list pointers - always add to last
        ptr_alloc_info->ptr_prev = g_ptr_tail_alloc_info;
        ptr_alloc_info->ptr_next = NULL;
        g_ptr_tail_alloc_info->ptr_next = ptr_alloc_info;
        g_ptr_tail_alloc_info = ptr_alloc_info;

        if (DEBUG) {
            print_h1("Reserved more space, alloc_info");
            print_ptr("address", ptr_alloc_info);
            print_ptr("first free segment", ptr_alloc_info->ptr_first_free_segment);
            print_num("actual size", ptr_alloc_info->size_actual);
            print_num("total size", ptr_alloc_info->size_total);
            print_ptr("prev alloc_info", ptr_alloc_info->ptr_prev);
            print_ptr("next alloc_info", ptr_alloc_info->ptr_next);
        }
    }

    // create segment info
    segment_info* ptr_current_segment = (segment_info*)ptr_alloc_info->ptr_first_free_segment;
    ptr_current_segment->size = size_user_data + sizeof(segment_info);
    ptr_current_segment->ptr_page = (void*)ptr_alloc_info;

    // set linked list pointers
    if (!ptr_alloc_info->ptr_head_segment_info) {
        ptr_current_segment->ptr_prev = ptr_current_segment->ptr_next = NULL;
        ptr_alloc_info->ptr_head_segment_info = ptr_alloc_info->ptr_tail_segment_info = ptr_current_segment;
    }
    else {
        ptr_current_segment->ptr_prev = ptr_alloc_info->ptr_tail_segment_info;
        ptr_current_segment->ptr_next = NULL;
        ptr_alloc_info->ptr_tail_segment_info->ptr_next = ptr_current_segment;
        ptr_alloc_info->ptr_tail_segment_info = ptr_current_segment;
    }

    // update alloc_info object
    ptr_alloc_info->size_actual += ptr_current_segment->size;
    ptr_alloc_info->ptr_first_free_segment += ptr_current_segment->size;

    if (DEBUG) {
        print_h1("Added segment");
        print_ptr("address", ptr_current_segment);

        print_h1("Updated alloc_info");
        print_ptr("first free segment", ptr_alloc_info->ptr_first_free_segment);
        print_ptr("head segment", ptr_alloc_info->ptr_head_segment_info);
        print_ptr("tail segment", ptr_alloc_info->ptr_tail_segment_info);
    }

    if (DEBUG) {
        print_h1("Printing segment_info list");
        {
            segment_info* temp = ptr_alloc_info->ptr_head_segment_info;
            while (temp) {
                print_ptr("address", temp);
                printf("\t-> data address: %lu\n", (long)((void*)temp + sizeof(segment_info)) % (10u * 10 * 10 * 10 * 10));
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
    print_h1("---------- MY FREE ---------");

    // config
    void* ptr_data = ptr_memory - sizeof(segment_info);
    segment_info* ptr_segment_info = (segment_info*)ptr_data;
    alloc_info* ptr_alloc_info = (alloc_info*)ptr_segment_info->ptr_page;

    if (DEBUG) {
        print_h1("Segment address to free");
        print_ptr("address", ptr_segment_info);
        print_ptr("alloc_info", ptr_alloc_info);
    }

    // remove segment from linked list
    if (!ptr_segment_info->ptr_prev && !ptr_segment_info->ptr_next) {
        if (DEBUG)
            print_h1("Deleting the only segment left");

        ptr_alloc_info->ptr_head_segment_info = ptr_alloc_info->ptr_tail_segment_info = NULL;
    }
    else if (!ptr_segment_info->ptr_prev) {
        if (DEBUG)
            print_h1("Deleting first segment");

        ptr_alloc_info->ptr_head_segment_info = ptr_segment_info->ptr_next;
        ptr_segment_info->ptr_next = ptr_segment_info->ptr_next->ptr_prev = NULL;
    }
    else if (!ptr_segment_info->ptr_next) {
        if (DEBUG)
            print_h1("Deleting last segment");

        ptr_alloc_info->ptr_tail_segment_info = ptr_segment_info->ptr_prev;
        ptr_segment_info->ptr_prev = ptr_segment_info->ptr_prev->ptr_next = NULL;
    }
    else {
        if (DEBUG)
            print_h1("Deleting middle segment");

        ptr_segment_info->ptr_next->ptr_prev = ptr_segment_info->ptr_prev;
        ptr_segment_info->ptr_prev->ptr_next = ptr_segment_info->ptr_next;
        ptr_segment_info->ptr_next = ptr_segment_info->ptr_prev = NULL;
    }

    if (DEBUG) {
        print_h1("Printing segment_info list");
        {
            segment_info* temp = ptr_alloc_info->ptr_head_segment_info;
            while (temp) {
                print_num("size", (int)(temp->size - sizeof(segment_info)));
                print_ptr("address", temp);
                printf("\t-> data address: %lu\n", (long)((void*)temp + sizeof(segment_info)) % (10u * 10 * 10 * 10 * 10));
                print_ptr("prev", temp->ptr_prev);
                print_ptr("next", temp->ptr_next);
                printf("\n");
                temp = temp->ptr_next;
            }
        }

        print_h1("alloc_info");
        print_ptr("address", ptr_alloc_info);
        print_ptr("alloc head", ptr_alloc_info->ptr_head_segment_info);
        print_ptr("alloc tail", ptr_alloc_info->ptr_tail_segment_info);
    }

    // if no segments, deallocate memory
    if (!ptr_alloc_info->ptr_head_segment_info && !ptr_alloc_info->ptr_tail_segment_info) {
        // remove alloc_info from global linked list
        if (!ptr_alloc_info->ptr_prev && !ptr_alloc_info->ptr_next) {
            if (DEBUG)
                print_h1("Deleting the only alloc_info left");

            g_ptr_head_alloc_info = g_ptr_tail_alloc_info = NULL;
        }
        else if (!ptr_alloc_info->ptr_prev) {
            if (DEBUG)
                print_h1("Deleting first alloc_info");

            g_ptr_head_alloc_info = ptr_alloc_info->ptr_next;
            ptr_alloc_info->ptr_next = ptr_alloc_info->ptr_next->ptr_prev = NULL;
        }
        else if (!ptr_alloc_info->ptr_next) {
            if (DEBUG)
                print_h1("Deleting last alloc_info");

            g_ptr_tail_alloc_info = ptr_alloc_info->ptr_prev;
            ptr_alloc_info->ptr_prev = ptr_alloc_info->ptr_prev->ptr_next = NULL;
        }
        else {
            if (DEBUG)
                print_h1("Deleting middle alloc_info");

            ptr_alloc_info->ptr_next->ptr_prev = ptr_alloc_info->ptr_prev;
            ptr_alloc_info->ptr_prev->ptr_next = ptr_alloc_info->ptr_next;
            ptr_alloc_info->ptr_next = ptr_alloc_info->ptr_prev = NULL;
        }

        if (DEBUG) {
            print_h1("Printing alloc_info list after changing");
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

        const int result = munmap((void*)ptr_alloc_info, ptr_alloc_info->size_total);
        if (result == -1)
            perror("munmap");

        // no dangling pointers
        ptr_alloc_info = NULL;
        print_h1("Memory unmapped");
    }
}
