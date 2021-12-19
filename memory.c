#include "memory.h"

// globals
alloc_info* g_ptr_head_alloc_info = NULL;
alloc_info* g_ptr_tail_alloc_info = NULL;

unsigned get_size_rounded(unsigned);
alloc_info* allocate(unsigned);
void print_alloc_info(alloc_info*), print_segment_info(segment_info*), print_linked_list();

void* my_malloc(const unsigned size_user_data) {
    print_h1("---------- MY MALLOC ---------");
    alloc_info* ptr_alloc_info;

    // create alloc_info object
    if (!g_ptr_head_alloc_info && !g_ptr_tail_alloc_info) {
        // round size_total to multiple of getpagesize() and allocate memory
        const unsigned size_total = get_size_rounded(size_user_data);
        ptr_alloc_info = allocate(size_total);

        // set head and tail of global alloc_info linked list
        g_ptr_head_alloc_info = g_ptr_tail_alloc_info = ptr_alloc_info;

        if (DEBUG) {
            print_h1("Creating first alloc_info block");
            printf("\nAllocated %u bytes\n", size_total);
            print_alloc_info(ptr_alloc_info);
        }
    }

    // if no space is available at current page for new segment, create new alloc_info object
    const int space_left = ptr_alloc_info->size_total - ptr_alloc_info->size_actual - size_user_data - sizeof(alloc_info) - sizeof(segment_info);

    if (DEBUG)
        printf("\n%d bytes of space left\n", space_left);

    if (space_left <= 0) {
        // round size_total to multiple of getpagesize() and allocate memory
        const unsigned size_total = size_user_data + sizeof(alloc_info) + getpagesize() - (size_user_data + sizeof(alloc_info)) % getpagesize();
        ptr_alloc_info = allocate(size_total);

        // set global linked list pointers - add to end
        ptr_alloc_info->ptr_prev = g_ptr_tail_alloc_info;
        ptr_alloc_info->ptr_next = NULL;
        g_ptr_tail_alloc_info->ptr_next = ptr_alloc_info;
        g_ptr_tail_alloc_info = ptr_alloc_info;

        if (DEBUG) {
            print_h1("No more space in current alloc_info block, creating new");
            printf("\nAllocated %u bytes\n", size_total);
            print_alloc_info(ptr_alloc_info);
        }
    }

    // create segment info
    segment_info* ptr_segment_info = (segment_info*)ptr_alloc_info->ptr_first_free_segment;
    ptr_segment_info->size = size_user_data + sizeof(segment_info);
    ptr_segment_info->ptr_page = (void*)ptr_alloc_info;

    // set segment linked list pointers
    if (!ptr_alloc_info->ptr_head_segment_info) {
        if (DEBUG)
            print_h1("Creating first segment");

        ptr_segment_info->ptr_prev = ptr_segment_info->ptr_next = NULL;
        ptr_alloc_info->ptr_head_segment_info = ptr_alloc_info->ptr_tail_segment_info = ptr_segment_info;
    }
    else {
        /*
        TODO: functionality to search for free space and squeeze segment into the middle of linked list, not at the end
        */

        if (DEBUG)
            print_h1("Not first segment, adding to the end");

        // add segment to the end
        ptr_segment_info->ptr_prev = ptr_alloc_info->ptr_tail_segment_info;
        ptr_segment_info->ptr_next = NULL;
        ptr_alloc_info->ptr_tail_segment_info->ptr_next = ptr_segment_info;
        ptr_alloc_info->ptr_tail_segment_info = ptr_segment_info;
    }

    // update alloc_info object
    ptr_alloc_info->size_actual += ptr_segment_info->size;
    ptr_alloc_info->ptr_first_free_segment += ptr_segment_info->size;

    if (DEBUG) {
        print_h1("Printing global linked list");
        print_linked_list();
    }

    // return [ address of segment ] + [ size of segment ]
    return (void*)ptr_segment_info + sizeof(segment_info);
}

void my_free(void* ptr_memory) {
    print_h1("---------- MY FREE ---------");

    // config
    void* ptr_data = ptr_memory - sizeof(segment_info);
    segment_info* ptr_segment_info = (segment_info*)ptr_data;
    alloc_info* ptr_alloc_info = (alloc_info*)ptr_segment_info->ptr_page;

    if (DEBUG) {
        print_h1("Freeing segment");
        print_ptr("\t- address:    ", ptr_segment_info);
        print_ptr("\t- alloc_info: ", ptr_alloc_info);
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

        const int result = munmap((void*)ptr_alloc_info, ptr_alloc_info->size_total);
        if (result == -1)
            perror("munmap");

        // no dangling pointers
        ptr_alloc_info = NULL;
        print_h1("Memory unmapped");
    }

    if (DEBUG) {
        print_h1("Updated global linked list");
        print_linked_list();
    }
}

unsigned get_size_rounded(unsigned size_user_data) {
    unsigned size = size_user_data + sizeof(alloc_info) + sizeof(segment_info);
    for (unsigned i = 1; i < INT_MAX; i++)
        if (size > (i - 1) * getpagesize() && size <= i * getpagesize())
            return i * getpagesize();
    return 0;
}

alloc_info* allocate(const unsigned size_total) {
    alloc_info* ptr_alloc_info = NULL;

    // info
    ptr_alloc_info = (alloc_info*)mmap(NULL, size_total, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    ptr_alloc_info->size_actual = sizeof(alloc_info);
    ptr_alloc_info->size_total = size_total;
    ptr_alloc_info->ptr_first_free_segment = ptr_alloc_info + 1;

    // segment linked list
    ptr_alloc_info->ptr_head_segment_info = ptr_alloc_info->ptr_tail_segment_info = NULL;
    ptr_alloc_info->ptr_prev = ptr_alloc_info->ptr_next = NULL;

    return ptr_alloc_info;
}

void print_alloc_info(alloc_info* ptr_alloc_info) {
    printf("\t- actual size:          %u\n", ptr_alloc_info->size_actual);
    printf("\t- total size:           %u\n", ptr_alloc_info->size_total);
    print_ptr("\t- first free segment:   ", ptr_alloc_info->ptr_first_free_segment);
    print_ptr("\t- head segment pointer: ", ptr_alloc_info->ptr_head_segment_info);
    print_ptr("\t- tail segment pointer: ", ptr_alloc_info->ptr_tail_segment_info);
}

void print_segment_info(segment_info* ptr_segment_info) {
    printf("\t* actual size:        %u\n", ptr_segment_info->size);
    print_ptr("\t* pointer to page: ", ptr_segment_info->ptr_page);
}

void print_linked_list() {
    alloc_info* ptr_alloc_info = g_ptr_head_alloc_info;
    while (ptr_alloc_info) {
        print_ptr("\t- current address:      ", ptr_alloc_info);
        print_alloc_info(ptr_alloc_info);
        print_ptr("\t- prev alloc_info:      ", ptr_alloc_info->ptr_prev);
        print_ptr("\t- next alloc_info:      ", ptr_alloc_info->ptr_next);

        printf("\t- segments\n");
        segment_info* ptr_segment_info = ptr_alloc_info->ptr_head_segment_info;
        while (ptr_segment_info) {
            print_ptr("\t\t* address       ", ptr_segment_info);
            printf("\t\t* data address: %lu\n", (long)((void*)ptr_segment_info + sizeof(segment_info)) % (10u * 10 * 10 * 10 * 10));
            print_ptr("\t\t* prev:         ", ptr_segment_info->ptr_prev);
            print_ptr("\t\t* next:         ", ptr_segment_info->ptr_next);
            printf("\n");

            ptr_segment_info = ptr_segment_info->ptr_next;
        }

        printf("\n");
        ptr_alloc_info = ptr_alloc_info->ptr_next;
    }
}