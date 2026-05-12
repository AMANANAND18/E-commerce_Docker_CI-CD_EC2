package backend.service;

import backend.entity.Product;
import backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

  private final ProductRepository productRepository;

  public Product save(Product product) {
    return productRepository.save(product);
  }

  public List<Product> getAll() {
    return productRepository.findAll();
  }

  public Product getById(Long id) {
    return productRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Product not found"));
  }

  public void delete(Long id) {
    productRepository.deleteById(id);
  }
}