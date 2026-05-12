package backend.controller;

import backend.entity.Product;
import backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ProductController {

  private final ProductService productService;

  @GetMapping
  public List<Product> getAll() {
    return productService.getAll();
  }

  @GetMapping("/{id}")
  public Product getById(@PathVariable Long id) {
    return productService.getById(id);
  }

  @PostMapping("/admin")
  public Product create(@RequestBody Product product) {
    return productService.save(product);
  }

  @DeleteMapping("/admin/{id}")
  public void delete(@PathVariable Long id) {
    productService.delete(id);
  }
}