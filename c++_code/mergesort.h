#ifndef mergesort_H
#define mergesort_H

#include <vector>

template <typename T> void merge(std::vector<T>& numbers, int firstToSort, int midPoint, int lastToSort) {
    int mergedSize;
    int mergePos;
    int leftPos;
    int rightPos;

    mergePos = 0;
    mergedSize = lastToSort - firstToSort + 1;
    leftPos = firstToSort;
    rightPos = midPoint + 1;
    std::vector<T> mergedNumbers(mergedSize);

    while (leftPos <= midPoint && rightPos <= lastToSort) {
        if (numbers.at(leftPos) < numbers.at(rightPos)) {
            mergedNumbers.at(mergePos) = numbers.at(leftPos);
            ++leftPos;
        } else {
            mergedNumbers.at(mergePos) = numbers.at(rightPos);
            ++rightPos;
        }
        ++mergePos;
    }

    while (leftPos <= midPoint) {
        mergedNumbers.at(mergePos) = numbers.at(leftPos);
        ++leftPos;
        ++mergePos;
    }

    while (rightPos <= lastToSort) {
        mergedNumbers.at(mergePos) = numbers.at(rightPos);
        ++rightPos;
        ++mergePos;
    }

    for (mergePos = 0; mergePos < mergedSize; ++mergePos) {
        numbers.at(firstToSort + mergePos) = mergedNumbers.at(mergePos);
    }
}

template <typename T> void mergeSort(std::vector<T>& data, int firstToSort, int lastToSort) {
    int midPoint;

    if (firstToSort < lastToSort) {
        midPoint = (firstToSort + lastToSort) / 2;

        mergeSort(data, firstToSort, midPoint);
        mergeSort(data, midPoint + 1, lastToSort);

        merge(data, firstToSort, midPoint, lastToSort);
    }
}

#endif
