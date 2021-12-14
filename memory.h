#ifndef MEMORY_MANAGEMENT_MY_MALLOC_H
#define MEMORY_MANAGEMENT_MY_MALLOC_H

#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <sys/mman.h>

void* my_malloc(unsigned);
void my_free(void*);

#endif