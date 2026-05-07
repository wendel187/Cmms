package com.example.Cmms.domain.equipamento;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import java.util.Optional;

public interface EquipamentoRepository extends JpaRepository<Equipamento, Long> {
    
    Page<Equipamento> findByStatus(Status status, Pageable pageable);
    
    List<Equipamento> findBySetor(String setor);
    
    Page<Equipamento> findByCriticidade(Criticidade criticidade, Pageable pageable);
    
    Optional<Equipamento> findByCodigo(String codigo);
    
    Page<Equipamento> findBySetorAndStatus(String setor, Status status, Pageable pageable);
}



