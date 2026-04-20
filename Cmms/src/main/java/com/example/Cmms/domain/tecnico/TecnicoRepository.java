package com.example.Cmms.domain.tecnico;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TecnicoRepository extends JpaRepository<Tecnico, Long> {
    
    Page<Tecnico> findByAtivoTrue(Pageable pageable);
    
    Page<Tecnico> findByStatus(StatusTecnico status, Pageable pageable);
    
    List<Tecnico> findBySetorAndAtivoTrue(String setor);
    
    Optional<Tecnico> findByEmailAndAtivoTrue(String email);
}

