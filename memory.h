#ifndef MEMORY_MANAGEMENT_MY_MALLOC_H
#define MEMORY_MANAGEMENT_MY_MALLOC_H

#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <sys/mman.h>
#include <limits.h>

#define DEBUG true
#define print_h1(msg) printf("\n%s\n", msg);
#define print_ptr(msg, addr) printf("%s%lu\n", msg, (long)addr % (10u * 10 * 10 * 10 * 10))

typedef enum { false, true } bool;

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

void* my_malloc(unsigned);
void my_free(void*);

#endif