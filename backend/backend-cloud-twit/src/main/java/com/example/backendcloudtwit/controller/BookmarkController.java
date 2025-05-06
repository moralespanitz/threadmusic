package com.example.backendcloudtwit.controller;

import com.example.backendcloudtwit.model.Bookmark;
import com.example.backendcloudtwit.service.BookmarkService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {
    private final BookmarkService bookmarkService;

    public BookmarkController(BookmarkService bookmarkService) {
        this.bookmarkService = bookmarkService;
    }

    @PostMapping
    public ResponseEntity<Bookmark> create(@RequestBody Bookmark bookmark) {
        return ResponseEntity.ok(bookmarkService.createBookmark(bookmark));
    }

    /** GET ALL */
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Bookmark>> getAllBookmarks() {
        List<Bookmark> lista = bookmarkService.getAllBookmarks();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Bookmark>> getByUser(@PathVariable String userId) {
        return ResponseEntity.ok(bookmarkService.getBookmarksByUserId(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        bookmarkService.deleteBookmark(id);
        return ResponseEntity.noContent().build();
    }
}

