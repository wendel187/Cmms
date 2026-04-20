package com.example.Cmms.domain.equipamento;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EquipamentoRepository extends JpaRepository<Equipamento, Long> {
    Page<Equipamento> findByStatus(Status status, Pageable paginacao);
    List<Equipamento> findBySetor(String setor);
    Page<Equipamento> findByCriticidade(Criticidade criticidade, Pageable pageable);
}



