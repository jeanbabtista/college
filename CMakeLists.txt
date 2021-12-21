cmake_minimum_required(VERSION 3.10.2)
project(memory_management)

set(CMAKE_C_STANDARD 11)

add_executable(mymalloc main.c mymalloc.c mymalloc.h)