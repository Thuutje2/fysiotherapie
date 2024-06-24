package fysiotherapie.physiotherapy.application.service;

import fysiotherapie.physiotherapy.application.exception.JointNotFoundException;
import fysiotherapie.physiotherapy.data.JointRepository;
import fysiotherapie.physiotherapy.domain.Joint;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class JointService {
    private JointRepository jointRepository;

    public JointService(JointRepository jointRepository) {
        this.jointRepository = jointRepository;
    }

    private Joint tryFindingJointByType(String jointType) {
        return jointRepository.findJointByType(jointType).orElseThrow(()->
                new JointNotFoundException("Joint does not exist by given type"));
    };

    public Joint getJointByType(String jointType) {
        return tryFindingJointByType(jointType);
    }

    public Joint getJointByTypeFromList(List<Joint> joints, String jointType) {
        Optional<Joint> jointOptional = joints.stream()
                .filter(joint -> joint.getType().equalsIgnoreCase(jointType))
                .findFirst();
        return jointOptional.orElseThrow(() -> new JointNotFoundException("Joint not found by given type in measurement"));
    }

    public void saveJoint(Joint joint) {
        jointRepository.save(joint);
    }
}
