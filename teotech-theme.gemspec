Gem::Specification.new do |spec|
  spec.name          = "teotech-theme"
  spec.version       = "0.2.0"
  spec.authors       = ["Yael Méndez"]
  spec.summary       = "Theme Jekyll 9:16 con WebGPU y tutor WebLLM para OpenCourseWare."
  spec.license       = "MIT"
  spec.files         = Dir["_layouts/**/*", "_includes/**/*", "assets/**/*", "LICENSE", "README.md"]
  spec.add_runtime_dependency "jekyll", ">= 3.9"
end
