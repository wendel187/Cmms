package com.example.Cmms.domain.ordemservico;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoricoStatusRepository extends JpaRepository<HistoricoStatus, Long> {
    
    List<HistoricoStatus> findByOrdemServicoIdOrderByDataHoraDesc(Long ordemServicoId);
}

