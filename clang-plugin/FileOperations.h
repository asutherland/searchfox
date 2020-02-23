/* -*- Mode: C++; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef FileOperations_h
#define FileOperations_h

#include <fstream>
#include <iostream>
#include <stdio.h>
#include <string>

#if defined(_WIN32) || defined(_WIN64)
#include <cstdio>
#include <windows.h>
#define PATHSEP_CHAR '\\'
#define PATHSEP_STRING "\\"
#else
#define PATHSEP_CHAR '/'
#define PATHSEP_STRING "/"
#include <ext/stdio_filebuf.h>
#endif

// Make sure that all directories on path exist, excluding the final element of
// the path.
void ensurePath(std::string Path);

std::string getAbsolutePath(const std::string &Filename);

// Lock the given filename so that it cannot be opened by anyone else until this
// object goes out of scope. On Windows, we use a named mutex. On POSIX
// platforms, we use flock.
//
// ## Hack Alert: openFileAsStream
//
// There's some very hacky stuff in here around `openFileAsStream`.  The general
// issue is that the POSIX extension `getline` (not `std::getline`) is not
// available when building on Windows.  Originally a fixed-size buffer was used
// when reading existing lines in `HandleTranslationUnit`, but this was never
// correct and started corrupting things once `structured` record types were
// introduced.
//
// The goal is just to be able to read in all the lines in a file and write
// lines out to a file while holding a lock.  Unfortunately C++ streams are
// somewhat explicitly designed to avoid exposing the underlying file
// descriptor-based reality, etc.  So we've turned to:
// https://stackoverflow.com/questions/2746168/how-to-construct-a-c-fstream-from-a-posix-file-descriptor
// and generally made a mess.  (Or rather, :asuth did this, and if you're still
// reading this, others are now complicit ;).
//
// The grossness has been encapsulated in this file, but it's pretty clear that
// it would be better for an RAII helper to be used instead of having
// AutoLockFile be stateful.  But :asuth's sanity precludes further iteration at
// the time of writing this.
struct AutoLockFile {
  int FileDescriptor = -1;

#if defined(_WIN32) || defined(_WIN64)
  HANDLE Handle = NULL;
  std::ifstream *mStream;
  FILE *mStreamFile;
#else
  std::istream *mStream;
  __gnu_cxx::stdio_filebuf<char> *mFileBuf;
#endif

  AutoLockFile(const std::string &Filename);
  ~AutoLockFile();

  bool success();

  FILE *openFile(const char *Mode);
  std::istream &openFileAsStream(bool ForReading);
  void closeFileStream();

  bool truncateFile(size_t Length);
};

#endif
