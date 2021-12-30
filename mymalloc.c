#include "mymalloc.h"

#define DEBUG 0
#define debug_print_ptr(msg, addr) if (DEBUG) print_ptr(msg, addr)
#define debug_print_h1(msg) if (DEBUG) print_h1(msg)

struct segment_info {
    unsigned size;
    void* ptr_page;

    struct segment_info
        * ptr_prev,
        * ptr_next;
} typedef segment_info;

struct alloc_info {
    unsigned size_total;

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

// functions
unsigned get_size_rounded(unsigned);
alloc_info* allocate(unsigned);
void debug_print_alloc_info(alloc_info*), debug_print_segment_info(segment_info*), debug_print_linked_list();

void* mymalloc(const int size_user_data) {
    debug_print_h1("--------------------- MY MALLOC ---------------------");

    if (size_user_data < 0) return NULL;

    alloc_info* ptr_temp_alloc_info = g_ptr_head_alloc_info;
    segment_info* ptr_segment_info;

    // create alloc_info object
    if (!ptr_temp_alloc_info) {
        // round size_total to multiple of getpagesize() and allocate memory
        const unsigned size_total = get_size_rounded(size_user_data);
        ptr_temp_alloc_info = allocate(size_total);

        // set head and tail of global alloc_info linked list
        g_ptr_head_alloc_info = g_ptr_tail_alloc_info = ptr_temp_alloc_info;

        debug_print_h1("Creating first alloc_info block");
        debug_print_ptr("&alloc_info: ", g_ptr_head_alloc_info);
        if (DEBUG) {
            printf("sizeof(alloc_info):   %lu\n", sizeof(alloc_info));
            printf("sizeof(segment_info): %lu\n", sizeof(segment_info));
            printf("\nAllocated %u bytes\n", size_total);
        }
        debug_print_alloc_info(ptr_temp_alloc_info);
    }

    if (DEBUG) printf("\nSpace needed for new data:                  %lu\n", size_user_data + sizeof(segment_info));

    // loop through all alloc_info objects and segments and search for available space
    unsigned stop = 0;
    while (ptr_temp_alloc_info && !stop) {
        segment_info* ptr_temp_segment_info = ptr_temp_alloc_info->ptr_head_segment_info;

        if (!ptr_temp_segment_info) {
            debug_print_h1("Creating first segment in current alloc_info");

            // create segment info block
            ptr_segment_info = (segment_info*)(ptr_temp_alloc_info + 1);
            ptr_segment_info->size = size_user_data + sizeof(segment_info);
            ptr_segment_info->ptr_page = (void*)ptr_temp_alloc_info;

            // set pointers for linked list
            ptr_segment_info->ptr_prev = ptr_segment_info->ptr_next = NULL;
            ptr_temp_alloc_info->ptr_head_segment_info = ptr_temp_alloc_info->ptr_tail_segment_info = ptr_segment_info;

            debug_print_segment_info(ptr_segment_info);
            break;
        }

        unsigned size_space = (long unsigned)ptr_temp_segment_info - (long unsigned)ptr_temp_alloc_info - sizeof(alloc_info);
        if (DEBUG) printf("\t- Space between alloc_info and first segment: %u\n", size_space);

        // insert at the start
        if (size_space >= size_user_data + sizeof(segment_info)) {
            debug_print_h1("Enough space, inserting segment at the start");

            // create segment info block
            ptr_segment_info = (segment_info*)(ptr_temp_alloc_info + 1);
            ptr_segment_info->size = size_user_data + sizeof(segment_info);
            ptr_segment_info->ptr_page = (void*)ptr_temp_alloc_info;

            // set pointers for linked list
            ptr_segment_info->ptr_prev = NULL;
            ptr_segment_info->ptr_next = ptr_temp_segment_info;
            ptr_temp_segment_info->ptr_prev = ptr_segment_info;
            ptr_temp_alloc_info->ptr_head_segment_info = ptr_segment_info;

            debug_print_segment_info(ptr_segment_info);
            break;
        };

        // insert at the middle
        while (ptr_temp_segment_info->ptr_next) {
            size_space = (long unsigned)(void*)ptr_temp_segment_info->ptr_next - (long unsigned)(void*)ptr_temp_segment_info - ptr_temp_segment_info->size;
            if (DEBUG) printf("\t- Space between this and next segment:        %u\n", size_space);

            if (size_space >= size_user_data + sizeof(segment_info)) {
                debug_print_h1("Enough space, inserting segment at the middle");

                // create segment info block
                ptr_segment_info = (segment_info*)((void*)ptr_temp_segment_info + sizeof(segment_info) + size_user_data);
                ptr_segment_info->size = size_user_data + sizeof(segment_info);
                ptr_segment_info->ptr_page = (void*)ptr_temp_alloc_info;

                // set pointers for linked list
                ptr_segment_info->ptr_next = ptr_temp_segment_info->ptr_next;
                ptr_segment_info->ptr_prev = ptr_temp_segment_info;
                ptr_temp_segment_info->ptr_next = ptr_segment_info;
                ptr_segment_info->ptr_next->ptr_prev = ptr_segment_info;

                debug_print_segment_info(ptr_segment_info);
                stop = 1;
                break;
            };

            ptr_temp_segment_info = ptr_temp_segment_info->ptr_next;
        }

        if (stop)
            break;

        size_space = (long unsigned)ptr_temp_alloc_info + ptr_temp_alloc_info->size_total - ((long unsigned)ptr_temp_alloc_info->ptr_tail_segment_info + ptr_temp_alloc_info->ptr_tail_segment_info->size);
        if (DEBUG) printf("\t- Space left in this block:                   %u\n", size_space);

        // insert at the end
        if (size_space >= size_user_data + sizeof(segment_info)) {
            debug_print_h1("Enough space, inserting segment at the end");

            // create segment info block
            void* ptr_first_free = (void*)ptr_temp_alloc_info->ptr_tail_segment_info + ptr_temp_alloc_info->ptr_tail_segment_info->size;
            ptr_segment_info = (segment_info*)ptr_first_free;
            ptr_segment_info->size = size_user_data + sizeof(segment_info);
            ptr_segment_info->ptr_page = (void*)ptr_temp_alloc_info;

            // set pointers for linked list
            ptr_segment_info->ptr_prev = ptr_temp_alloc_info->ptr_tail_segment_info;
            ptr_segment_info->ptr_next = NULL;
            ptr_temp_alloc_info->ptr_tail_segment_info->ptr_next = ptr_segment_info;
            ptr_temp_alloc_info->ptr_tail_segment_info = ptr_segment_info;

            debug_print_segment_info(ptr_segment_info);
            break;
        }

        // not enough space, create new alloc_info block
        // round size_total to multiple of getpagesize() and allocate memory
        const unsigned size_total = get_size_rounded(size_user_data);
        alloc_info* ptr_alloc_info = allocate(size_total);

        // set global linked list pointers - add to end
        ptr_alloc_info->ptr_prev = g_ptr_tail_alloc_info;
        ptr_alloc_info->ptr_next = NULL;
        g_ptr_tail_alloc_info->ptr_next = ptr_alloc_info;
        g_ptr_tail_alloc_info = ptr_alloc_info;

        debug_print_h1("No more space in current alloc_info block, creating new");
        if (DEBUG) printf("\nAllocated %u bytes\n", size_total);
        debug_print_alloc_info(ptr_alloc_info);

        ptr_temp_alloc_info = g_ptr_tail_alloc_info;
    }

    debug_print_h1("Printing global linked list");
    debug_print_linked_list();

    return (void*)ptr_segment_info + sizeof(segment_info);
}

void myfree(void* ptr_memory) {
    debug_print_h1("--------------------- MY FREE ---------------------");

    // config
    void* ptr_data = ptr_memory - sizeof(segment_info);
    segment_info* ptr_segment_info = (segment_info*)ptr_data;
    alloc_info* ptr_alloc_info = (alloc_info*)ptr_segment_info->ptr_page;

    debug_print_h1("Freeing segment");
    debug_print_ptr("\t- address:    ", ptr_segment_info);
    debug_print_ptr("\t- alloc_info: ", ptr_alloc_info);

    // remove segment from linked list
    if (!ptr_segment_info->ptr_prev && !ptr_segment_info->ptr_next) {
        debug_print_h1("Deleting the only segment left");
        ptr_alloc_info->ptr_head_segment_info = ptr_alloc_info->ptr_tail_segment_info = NULL;
    }
    else if (!ptr_segment_info->ptr_prev) {
        debug_print_h1("Deleting first segment");
        ptr_alloc_info->ptr_head_segment_info = ptr_segment_info->ptr_next;
        ptr_segment_info->ptr_next = ptr_segment_info->ptr_next->ptr_prev = NULL;
    }
    else if (!ptr_segment_info->ptr_next) {
        debug_print_h1("Deleting last segment");
        ptr_alloc_info->ptr_tail_segment_info = ptr_segment_info->ptr_prev;
        ptr_segment_info->ptr_prev = ptr_segment_info->ptr_prev->ptr_next = NULL;
    }
    else {
        debug_print_h1("Deleting middle segment");
        ptr_segment_info->ptr_next->ptr_prev = ptr_segment_info->ptr_prev;
        ptr_segment_info->ptr_prev->ptr_next = ptr_segment_info->ptr_next;
        ptr_segment_info->ptr_next = ptr_segment_info->ptr_prev = NULL;
    }

    // if no segments, deallocate memory
    if (!ptr_alloc_info->ptr_head_segment_info && !ptr_alloc_info->ptr_tail_segment_info) {
        // remove alloc_info from global linked list
        if (!ptr_alloc_info->ptr_prev && !ptr_alloc_info->ptr_next) {
            debug_print_h1("Deleting the only alloc_info left");
            g_ptr_head_alloc_info = g_ptr_tail_alloc_info = NULL;
        }
        else if (!ptr_alloc_info->ptr_prev) {
            debug_print_h1("Deleting first alloc_info");
            g_ptr_head_alloc_info = ptr_alloc_info->ptr_next;
            ptr_alloc_info->ptr_next = ptr_alloc_info->ptr_next->ptr_prev = NULL;
        }
        else if (!ptr_alloc_info->ptr_next) {
            debug_print_h1("Deleting last alloc_info");
            g_ptr_tail_alloc_info = ptr_alloc_info->ptr_prev;
            ptr_alloc_info->ptr_prev = ptr_alloc_info->ptr_prev->ptr_next = NULL;
        }
        else {
            debug_print_h1("Deleting middle alloc_info");
            ptr_alloc_info->ptr_next->ptr_prev = ptr_alloc_info->ptr_prev;
            ptr_alloc_info->ptr_prev->ptr_next = ptr_alloc_info->ptr_next;
            ptr_alloc_info->ptr_next = ptr_alloc_info->ptr_prev = NULL;
        }

        const int result = munmap((void*)ptr_alloc_info, ptr_alloc_info->size_total);
        if (result == -1 && DEBUG)
            perror("munmap");

        debug_print_h1("Memory unmapped");
    }

    debug_print_h1("Updated global linked list:");
    debug_print_linked_list();
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
    ptr_alloc_info->size_total = size_total;

    // segment linked list
    ptr_alloc_info->ptr_head_segment_info = ptr_alloc_info->ptr_tail_segment_info = NULL;
    ptr_alloc_info->ptr_prev = ptr_alloc_info->ptr_next = NULL;

    return ptr_alloc_info;
}

void debug_print_alloc_info(alloc_info* ptr_alloc_info) {
    if (!DEBUG)
        return;

    printf("\t- total size:           %u\n", ptr_alloc_info->size_total);
    print_ptr("\t- head segment pointer: ", ptr_alloc_info->ptr_head_segment_info);
    print_ptr("\t- tail segment pointer: ", ptr_alloc_info->ptr_tail_segment_info);
}

void debug_print_segment_info(segment_info* ptr_segment_info) {
    if (!DEBUG)
        return;

    printf("\t* actual size:        %u\n", ptr_segment_info->size);
    print_ptr("\t* pointer to page:    ", ptr_segment_info->ptr_page);
    print_ptr("\t* first free:         ", (long)((void*)ptr_segment_info + ptr_segment_info->size) % (10u * 10 * 10 * 10 * 10));
}

void debug_print_linked_list() {
    if (!DEBUG)
        return;

    alloc_info* ptr_alloc_info = g_ptr_head_alloc_info;
    while (ptr_alloc_info) {
        print_ptr("\t- current address:      ", ptr_alloc_info);
        debug_print_alloc_info(ptr_alloc_info);
        print_ptr("\t- prev alloc_info:      ", ptr_alloc_info->ptr_prev);
        print_ptr("\t- next alloc_info:      ", ptr_alloc_info->ptr_next);

        printf("\t- segments\n");
        segment_info* ptr_segment_info = ptr_alloc_info->ptr_head_segment_info;
        while (ptr_segment_info) {
            print_ptr("\t\t* address       ", ptr_segment_info);
            printf("\t\t* data address: %lu\n", (long)(ptr_segment_info + 1) % (10u * 10 * 10 * 10 * 10));
            print_ptr("\t\t* prev:         ", ptr_segment_info->ptr_prev);
            print_ptr("\t\t* next:         ", ptr_segment_info->ptr_next);
            printf("\n");

            ptr_segment_info = ptr_segment_info->ptr_next;
        }

        printf("\n");
        ptr_alloc_info = ptr_alloc_info->ptr_next;
    }
}