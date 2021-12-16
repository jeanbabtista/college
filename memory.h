#ifndef MEMORY_MANAGEMENT_MY_MALLOC_H
#define MEMORY_MANAGEMENT_MY_MALLOC_H

#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <sys/mman.h>
#include <limits.h>

#define print_h1(msg) printf("\n%s\n", msg);
#define print_num(msg, num) printf("\t-> %s: %d\n", msg, num)
#define print_ptr(msg, addr) printf("\t-> %s: %lu\n", msg, (long)addr % (10u * 10 * 10 * 10 * 10))

void* my_malloc(unsigned);
void my_free(void*);

#endif