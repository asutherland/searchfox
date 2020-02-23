/* -*- Mode: C++; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "FileOperations.h"

#include <stdio.h>
#include <stdlib.h>

#if defined(_WIN32) || defined(_WIN64)
#include <direct.h>
#include <io.h>
#include <windows.h>
#include "StringOperations.h"
#else
#include <ext/stdio_filebuf.h>
#include <iostream>
#include <fstream>
#include <string>
#include <sys/file.h>
#include <sys/time.h>
#include <unistd.h>
#endif

#include <fcntl.h>
#include <sys/stat.h>
#include <sys/types.h>

// Make sure that all directories on path exist, excluding the final element of
// the path.
void ensurePath(std::string Path) {
  size_t Pos = 0;
  if (Path[0] == PATHSEP_CHAR) {
    Pos++;
  }

  while ((Pos = Path.find(PATHSEP_CHAR, Pos)) != std::string::npos) {
    std::string Portion = Path.substr(0, Pos);
    if (!Portion.empty()) {
#if defined(_WIN32) || defined(_WIN64)
      int Err = _mkdir(Portion.c_str());
#else
      int Err = mkdir(Portion.c_str(), 0775);
#endif
      if (Err == -1 && errno != EEXIST) {
        perror("mkdir failed");
        exit(1);
      }
    }

    Pos++;
  }
}

#if defined(_WIN32) || defined(_WIN64)
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// # Begin Windows Platform-Specific Stuff

AutoLockFile::AutoLockFile(const std::string &Filename) {
  std::string Hash = hash(Filename);
  std::string MutexName = std::string("Local\\searchfox-") + Hash;
  std::wstring WideMutexName;
  WideMutexName.assign(MutexName.begin(), MutexName.end());
  Handle = CreateMutex(nullptr, false, WideMutexName.c_str());
  if (Handle == NULL) {
    return;
  }

  if (WaitForSingleObject(Handle, INFINITE) != WAIT_OBJECT_0) {
    return;
  }

  FileDescriptor = _open(Filename.c_str(), _O_RDWR | _O_CREAT | _O_BINARY, 0666);
}

AutoLockFile::~AutoLockFile() {
  // idempotent, safe.
  closeFileStream();

  _close(FileDescriptor);

  ReleaseMutex(Handle);
  CloseHandle(Handle);
}

bool AutoLockFile::success() {
  return Handle != NULL && FileDescriptor != -1;
}

FILE *AutoLockFile::openFile(const char *Mode) {
  _lseek(FileDescriptor, 0, SEEK_SET);
  return _fdopen(_dup(FileDescriptor), Mode);
}

std::istream &AutoLockFile::openFileAsStream(bool ForReading) {
  mStreamFile = openFile(ForReading ? "rb" : "wb");
  mStream = new std::ifstream(mStreamFile);

  return *mStream;
}

void AutoLockFile::closeFileStream() {
  if (mStream) {
    delete mStream;
    mStream = nullptr;
  }

  if (mStreamFile) {
    fclose(mStreamFile);
    mStreamFile = nullptr;
  }
}

bool AutoLockFile::truncateFile(size_t Length) {
  return _chsize(FileDescriptor, Length) == 0;
}

std::string getAbsolutePath(const std::string &Filename) {
  char Full[_MAX_PATH];
  if (!_fullpath(Full, Filename.c_str(), _MAX_PATH)) {
    return std::string("");
  }
  return std::string(Full);
}

#else
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// # Begin non-Windows Platform-Specific Stuff

AutoLockFile::AutoLockFile(const std::string &Filename) {
  FileDescriptor = open(Filename.c_str(), O_RDWR | O_CREAT, 0666);
  if (FileDescriptor == -1) {
    return;
  }

  do {
    int rv = flock(FileDescriptor, LOCK_EX);
    if (rv == 0) {
      break;
    }
  } while (true);
}

AutoLockFile::~AutoLockFile() {
  // idempotent, safe.
  closeFileStream();

  close(FileDescriptor);
}

bool AutoLockFile::success() { return FileDescriptor != -1; }

FILE *AutoLockFile::openFile(const char *Mode) {
  lseek(FileDescriptor, 0, SEEK_SET);
  return fdopen(dup(FileDescriptor), Mode);
}

std::istream &AutoLockFile::openFileAsStream(bool ForReading) {
  mFileBuf = new __gnu_cxx::stdio_filebuf<char>(
    dup(FileDescriptor), ForReading ? std::ios::in : std::ios::out);
  mStream = new std::istream(mFileBuf);

  return *mStream;
}

void AutoLockFile::closeFileStream() {
  if (mStream) {
    delete mStream;
    mStream = nullptr;
  }

  if (mFileBuf) {
    delete mFileBuf;
    mFileBuf = nullptr;
  }
}

bool AutoLockFile::truncateFile(size_t Length) {
  return ftruncate(FileDescriptor, Length) == 0;
}

std::string getAbsolutePath(const std::string &Filename) {
  char Full[4096];
  if (!realpath(Filename.c_str(), Full)) {
    return std::string("");
  }
  return std::string(Full);
}
#endif
