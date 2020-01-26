/**
 * Contains our custom block definitions as initially created via:
 * https://blockly-demo.appspot.com/static/demos/blockfactory/index.html
 *
 * Our blocks are processed to a HierNode representation via
 * `custom_generator.js`, noting that it's not strictly a code generator like
 * the normal blockly ones.  But from a terminology perspective, calling it a
 * generator makes sense.
 *
 * We currently attempt to abuse the variables mechanism to simplify edge
 * generation.  Everything that an edge can be drawn to is named via variable
 * where its name is an identifier.  This provides dynamically updating
 * dropdowns so that edges can be more easily defined.  It's quite possible this
 * may want to evolve.
 */

import Blockly from 'blockly/core';

const diagram_settings_def = {
  "type": "diagram_settings",
  "message0": "Diagram Settings %1 %2",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "SETTINGS",
      "check": "setting"
    }
  ],
  "colour": 60,
  "tooltip": "",
  "helpUrl": ""
};
Blockly.Blocks['diagram_settings'] = {
  init() {
    this.jsonInit(diagram_settings_def);
  }
};

// TODO: rename to be about the group color
const setting_instance_group_def = {
  "type": "setting_instance_group",
  "message0": "Group %1 gets color %2",
  "args0": [
    {
      "type": "field_variable",
      "name": "INST_NAME",
      "variable": null,
      "variableTypes": ["instance-group"],
      "defaultType": "instance-group"
    },
    {
      "type": "field_colour",
      "name": "INST_COLOR",
      "colour": "#ccffff"
    }
  ],
  "previousStatement": "setting",
  "nextStatement": "setting",
  "colour": 30,
  "tooltip": "",
  "helpUrl": ""
};
Blockly.Blocks['setting_instance_group'] = {
  init() {
    this.jsonInit(setting_instance_group_def);
  }
};

const setting_group_rank_def = {
  "type": "setting_group_rank",
  "message0": "Group %1 gets layout rank %2",
  "args0": [
    {
      "type": "field_variable",
      "name": "INST_NAME",
      "variable": null,
      "variableTypes": ["instance-group"],
      "defaultType": "instance-group"
    },
    {
      "type": "field_dropdown",
      "name": "RANK",
      "options": [
        [
          "same",
          "same"
        ],
        [
          "min",
          "min"
        ],
        [
          "source",
          "source"
        ],
        [
          "max",
          "max"
        ],
        [
          "sink",
          "sink"
        ]
      ]
    }
  ],
  "previousStatement": "setting",
  "nextStatement": "setting",
  "colour": 30,
  "tooltip": "",
  "helpUrl": ""
};
Blockly.Blocks['setting_group_rank'] = {
  init() {
    this.jsonInit(setting_group_rank_def);
  }
};

const setting_algo_def = {
  "type": "setting_algo",
  "message0": "Layout Direction: %1 %2 Rendering Engine %3",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "LAYOUT_DIR",
      "options": [
        [
          "LR",
          "LR"
        ],
        [
          "TD",
          "TD"
        ]
      ]
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_dropdown",
      "name": "ENGINE",
      "options": [
        [
          "dot",
          "dot"
        ],
        [
          "neato",
          "neato"
        ],
        [
          "fdp",
          "fdp"
        ]
      ]
    }
  ],
  "previousStatement": "setting",
  "nextStatement": "setting",
  "colour": 30,
  "tooltip": "",
  "helpUrl": ""
};
Blockly.Blocks['setting_algo'] = {
  init() {
    this.jsonInit(setting_algo_def);
  }
};

const cluster_process_def = {
  "type": "cluster_process",
  "message0": "Process %1 %2 %3",
  "args0": [
    {
      "type": "field_input",
      "name": "NAME",
      "text": "Parent"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "CHILDREN",
      "check": "graphy"
    }
  ],
  "previousStatement": "graphy",
  "nextStatement": "graphy",
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
};
Blockly.Blocks['cluster_process'] = {
  init() {
    this.jsonInit(cluster_process_def);
  }
};

const cluster_thread_def = {
  "type": "cluster_thread",
  "message0": "Thread %1 %2 %3",
  "args0": [
    {
      "type": "field_input",
      "name": "NAME",
      "text": "Main"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "CHILDREN",
      "check": "graphy"
    }
  ],
  "previousStatement": "graphy",
  "nextStatement": "graphy",
  "colour": 105,
  "tooltip": "",
  "helpUrl": ""
};
Blockly.Blocks['cluster_thread'] = {
  init() {
    this.jsonInit(cluster_thread_def);
  }
};

const cluster_client_def = {
  "type": "cluster_client",
  "message0": "%1 %2 %3 %4",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "CLIENT_KIND",
      "options": [
        [
          "Window",
          "CLIENT_WINDOW"
        ],
        [
          "DedicatedWorker",
          "CLIENT_DEDICATED_WORKER"
        ],
        [
          "ServiceWorker",
          "CLIENT_SERVICE_WORKER"
        ],
        [
          "SharedWorker",
          "CLIENT_SHARED_WORKER"
        ]
      ]
    },
    {
      "type": "field_input",
      "name": "NAME",
      "text": ""
    },
    {
      "type": "input_value",
      "name": "INSTANCE",
      "check": "instance"
    },
    {
      "type": "input_statement",
      "name": "CHILDREN",
      "check": "graphy"
    }
  ],
  "inputsInline": false,
  "previousStatement": "graphy",
  "nextStatement": "graphy",
  "colour": 330,
  "tooltip": "",
  "helpUrl": ""
};
Blockly.Blocks['cluster_client'] = {
  init() {
    this.jsonInit(cluster_client_def);
  }
};

const node_class_def = {
  "type": "node_class",
  "message0": "Class %1 %2 %3",
  "args0": [
    {
      "type": "field_variable",
      "name": "NAME",
      "variable": null,
      "variableTypes": ["id-class"],
      "defaultType": "id-class"
    },
    {
      "type": "input_value",
      "name": "INSTANCE",
      "check": "instance"
    },
    {
      "type": "input_statement",
      "name": "METHODS",
      "check": "methorcall"
    }
  ],
  "inputsInline": false,
  "previousStatement": "graphy",
  "nextStatement": "graphy",
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
};
Blockly.Blocks['node_class'] = {
  init() {
    this.jsonInit(node_class_def);
  }
};

const edge_use_def = {
  "type": "edge_use",
  "message0": "Uses %1 %2",
  "args0": [
    {
      "type": "field_variable",
      "name": "CALLS_WHAT",
      "variable": null,
      "variableTypes": ["id-class"],
      "defaultType": "id-class"
    },
    {
      "type": "input_value",
      "name": "INSTANCE",
      "check": "instance"
    }
  ],
  "inputsInline": false,
  "previousStatement": "methorcall",
  "nextStatement": "methorcall",
  "colour": 280,
  "tooltip": "",
  "helpUrl": ""
};
Blockly.Blocks['edge_use'] = {
  init() {
    this.jsonInit(edge_use_def);
  }
};

const edge_call_def = {
  "type": "edge_call",
  "message0": "Calls %1::%2 %3",
  "args0": [
    {
      "type": "field_variable",
      "name": "CALLS_CLASS",
      "variable": null,
      "variableTypes": ["id-class"],
      "defaultType": "id-class"
    },
    {
      "type": "field_variable",
      "name": "CALLS_METHOD",
      "variable": null,
      "variableTypes": ["id-method"],
      "defaultType": "id-method"
    },
    {
      "type": "input_value",
      "name": "INSTANCE",
      "check": "instance"
    }
  ],
  "inputsInline": false,
  "previousStatement": "methorcall",
  "nextStatement": "methorcall",
  "colour": 285,
  "tooltip": "",
  "helpUrl": ""
};
Blockly.Blocks['edge_call'] = {
  init() {
    this.jsonInit(edge_call_def);
  }
};

const edge_ref_def = {
  "type": "edge_ref",
  "message0": "%1 ref to %2 %3",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "STRENGTH",
      "options": [
        [
          "Strong",
          "STRONG"
        ],
        [
          "Weak",
          "WEAK"
        ],
        [
          "Raw",
          "RAW"
        ]
      ]
    },
    {
      "type": "field_variable",
      "name": "CALLS_WHAT",
      "variable": null,
      "variableTypes": ["id-class"],
      "defaultType": "id-class"
    },
    {
      "type": "input_value",
      "name": "INSTANCE",
      "check": "instance"
    }
  ],
  "inputsInline": false,
  "previousStatement": "methorcall",
  "nextStatement": "methorcall",
  "colour": 270,
  "tooltip": "",
  "helpUrl": ""
};
Blockly.Blocks['edge_ref'] = {
  init() {
    this.jsonInit(edge_ref_def);
  }
};

const node_method_def = {
  "type": "node_method",
  "message0": "Method %1 %2 %3",
  "args0": [
    {
      "type": "field_variable",
      "name": "NAME",
      "variable": null,
      "variableTypes": ["id-method"],
      "defaultType": "id-method"
    },
    {
      "type": "input_value",
      "name": "INSTANCE",
      "check": "instance"
    },
    {
      "type": "input_statement",
      "name": "METHODS",
      "check": "methorcall"
    }
  ],
  "inputsInline": false,
  "previousStatement": "methorcall",
  "nextStatement": "methorcall",
  "colour": 165,
  "tooltip": "",
  "helpUrl": ""
};
Blockly.Blocks['node_method'] = {
  init() {
    this.jsonInit(node_method_def);
  }
};

const node_field_def = {
  "type": "node_field",
  "message0": "Field %1 %2 %3",
  "args0": [
    {
      "type": "field_variable",
      "name": "NAME",
      "variable": null,
      "variableTypes": ["id-field"],
      "defaultType": "id-field"
    },
    {
      "type": "input_value",
      "name": "INSTANCE",
      "check": "instance"
    },
    {
      "type": "input_statement",
      "name": "METHODS",
      "check": "methorcall"
    }
  ],
  "inputsInline": false,
  "previousStatement": "methorcall",
  "nextStatement": "methorcall",
  "colour": 180,
  "tooltip": "",
  "helpUrl": ""
};
Blockly.Blocks['node_field'] = {
  init() {
    this.jsonInit(node_field_def);
  }
};

const instance_group_ref_def = {
  "type": "instance_group_ref",
  "message0": "Group %1",
  "args0": [
    {
      "type": "field_variable",
      "name": "INST_NAME",
      "variable": null,
      "variableTypes": ["instance-group"],
      "defaultType": "instance-group"
    }
  ],
  "inputsInline": false,
  "output": "instance",
  "colour": 30,
  "tooltip": "",
  "helpUrl": ""
};
Blockly.Blocks['instance_group_ref'] = {
  init() {
    this.jsonInit(instance_group_ref_def);
  }
};
