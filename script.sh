#!/bin/bash

# bash script.sh <file data directory> <type of function>

if [ $# -ne 1 ]; then
    echo "Error: bash script.sh <file data directory>"
    exit -1
fi

cd $1

function execute {
    echo "---------------------------------------"
    echo "function: $1, buffer: $2"
    
    for file in *; do
        echo $file
        echo `../build/histZnakov -b $2 -t $1 -f $file`
    done
}

functions=(read fread mmap)
buffers=(1 256 512 1024 2048 4096 8192 16384)

echo > ../results.txt

for function in ${functions[@]}; do
    for buffer in ${buffers[@]}; do
        execute $function $buffer >> ../results.txt

        if [ $function = "mmap" ]; then
            exit 0
        fi

        echo >> ../results.txt
    done

    echo >> ../results.txt
done