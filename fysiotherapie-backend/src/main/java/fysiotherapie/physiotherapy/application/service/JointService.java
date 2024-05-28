package fysiotherapie.physiotherapy.application.service;

import fysiotherapie.physiotherapy.data.JointRepository;
import fysiotherapie.physiotherapy.domain.Joint;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class JointService {
    private JointRepository jointRepository;

    public JointService(JointRepository jointRepository) {
        this.jointRepository = jointRepository;
    }

    public void saveJoint(Joint joint) {
        jointRepository.save(joint);
    }
}
