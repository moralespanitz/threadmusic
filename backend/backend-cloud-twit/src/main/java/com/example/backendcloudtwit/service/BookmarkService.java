package com.example.backendcloudtwit.service;

import com.example.backendcloudtwit.model.Bookmark;
import com.example.backendcloudtwit.repository.BookmarkRepository;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class BookmarkService {
    private final BookmarkRepository bookmarkRepository;

    public BookmarkService(BookmarkRepository bookmarkRepository) {
        this.bookmarkRepository = bookmarkRepository;
    }

    public Bookmark createBookmark(Bookmark bookmark) {
        return bookmarkRepository.save(bookmark);
    }

    public List<Bookmark> getBookmarksByUserId(String userId) {
        return bookmarkRepository.findByUser(userId);
    }

    public void deleteBookmark(String id) {
        bookmarkRepository.deleteById(id);
    }
}

