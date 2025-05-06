package com.example.backendcloudtwit.controller;

import com.example.backendcloudtwit.model.Bookmark;
import com.example.backendcloudtwit.service.BookmarkService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(name = "Hilos", description = "CRUD de hilos y operaciones relacionadas")
@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {
    private final BookmarkService bookmarkService;

    public BookmarkController(BookmarkService bookmarkService) {
        this.bookmarkService = bookmarkService;
    }

    @Operation(summary = "Crear un nuevo bookmark")
    @PostMapping
    public ResponseEntity<Bookmark> create(@RequestBody Bookmark bookmark) {
        return ResponseEntity.ok(bookmarkService.createBookmark(bookmark));
    }

    /** GET ALL */
    @Operation(summary = "Get All Bookmarks")
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Bookmark>> getAllBookmarks() {
        List<Bookmark> lista = bookmarkService.getAllBookmarks();
        return ResponseEntity.ok(lista);
    }

    @Operation(summary = "Get Bookmark By Id")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Bookmark>> getByUser(@PathVariable String userId) {
        return ResponseEntity.ok(bookmarkService.getBookmarksByUserId(userId));
    }

    @Operation(summary = "Delete bookmark")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        bookmarkService.deleteBookmark(id);
        return ResponseEntity.noContent().build();
    }
}

