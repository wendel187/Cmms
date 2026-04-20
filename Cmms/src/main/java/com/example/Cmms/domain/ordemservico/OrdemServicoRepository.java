package com.example.Cmms.domain.ordemservico;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdemServicoRepository extends JpaRepository<OrdemServico, Long> {
    
    Page<OrdemServico> findByStatus(StatusOrdemServico status, Pageable pageable);
    
    Page<OrdemServico> findByEquipamentoId(Long equipamentoId, Pageable pageable);
    
    Page<OrdemServico> findByTecnicoId(Long tecnicoId, Pageable pageable);
    
    List<OrdemServico> findBySetor(String setor);
    
    Page<OrdemServico> findByStatusAndTipo(StatusOrdemServico status, String tipo, Pageable pageable);
    
    @Query("SELECT os FROM OrdenServiço os WHERE os.status = 'ABERTA' ORDER BY os.dataAbertura ASC")
    List<OrdemServico> findAllAbertasOrdenadas();
}

