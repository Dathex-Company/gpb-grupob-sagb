-- Create Enum Types for Mentorias
CREATE TYPE mentoria_status AS ENUM ('draft', 'active', 'archived');
CREATE TYPE mentoria_type AS ENUM ('Carreira', 'Técnica', 'Produto', 'Gestão', 'Outro');
CREATE TYPE material_type AS ENUM ('pdf', 'video', 'link', 'notion', 'figma', 'github', 'slide', 'outro');

-- Create mentorias table (main table)
CREATE TABLE IF NOT EXISTS public.mentorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status mentoria_status NOT NULL DEFAULT 'draft',
    version TEXT NOT NULL DEFAULT '1.0.0',
    type mentoria_type NOT NULL DEFAULT 'Outro',
    last_update TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    payload JSONB DEFAULT '{}'::jsonb,
    created_by UUID,
    updated_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create mentorias_blocos table (content blocks)
CREATE TABLE IF NOT EXISTS public.mentorias_blocos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentoria_id UUID NOT NULL REFERENCES public.mentorias(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_by UUID,
    updated_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create mentorias_materiais table (materials)
CREATE TABLE IF NOT EXISTS public.mentorias_materiais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentoria_id UUID NOT NULL REFERENCES public.mentorias(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type material_type NOT NULL,
    url TEXT NOT NULL,
    storage_path TEXT,
    size_bytes INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_by UUID,
    updated_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create mentorias_sessoes table (sessions)
CREATE TABLE IF NOT EXISTS public.mentorias_sessoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentoria_id UUID NOT NULL REFERENCES public.mentorias(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    duration_minutes INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_by UUID,
    updated_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create mentorias_versoes table (version history)
CREATE TABLE IF NOT EXISTS public.mentorias_versoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentoria_id UUID NOT NULL REFERENCES public.mentorias(id) ON DELETE CASCADE,
    version TEXT NOT NULL,
    changes TEXT,
    author_id UUID,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create mentorias_historico table (audit log)
CREATE TABLE IF NOT EXISTS public.mentorias_historico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentoria_id UUID NOT NULL REFERENCES public.mentorias(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    description TEXT,
    user_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create mentorias_agentes table (agents/contributors)
CREATE TABLE IF NOT EXISTS public.mentorias_agentes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentoria_id UUID NOT NULL REFERENCES public.mentorias(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID,
    updated_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mentorias_workspace ON public.mentorias(workspace_id);
CREATE INDEX IF NOT EXISTS idx_mentorias_status ON public.mentorias(status);
CREATE INDEX IF NOT EXISTS idx_mentorias_type ON public.mentorias(type);
CREATE INDEX IF NOT EXISTS idx_mentorias_blocos_mentoria ON public.mentorias_blocos(mentoria_id);
CREATE INDEX IF NOT EXISTS idx_mentorias_materiais_mentoria ON public.mentorias_materiais(mentoria_id);
CREATE INDEX IF NOT EXISTS idx_mentorias_sessoes_mentoria ON public.mentorias_sessoes(mentoria_id);
CREATE INDEX IF NOT EXISTS idx_mentorias_versoes_mentoria ON public.mentorias_versoes(mentoria_id);
CREATE INDEX IF NOT EXISTS idx_mentorias_historico_mentoria ON public.mentorias_historico(mentoria_id);
CREATE INDEX IF NOT EXISTS idx_mentorias_agentes_mentoria ON public.mentorias_agentes(mentoria_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.mentorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorias_blocos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorias_materiais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorias_sessoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorias_versoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorias_historico ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorias_agentes ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow authenticated users full access)
CREATE POLICY "Enable read access for authenticated users" ON public.mentorias FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON public.mentorias FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON public.mentorias_blocos FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON public.mentorias_blocos FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON public.mentorias_materiais FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON public.mentorias_materiais FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON public.mentorias_sessoes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON public.mentorias_sessoes FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON public.mentorias_versoes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON public.mentorias_versoes FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON public.mentorias_historico FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON public.mentorias_historico FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON public.mentorias_agentes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON public.mentorias_agentes FOR ALL USING (auth.role() = 'authenticated');

-- Create trigger for updated_at auto-update (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at column
DROP TRIGGER IF EXISTS update_mentorias_updated_at ON public.mentorias;
CREATE TRIGGER update_mentorias_updated_at BEFORE UPDATE ON public.mentorias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_mentorias_blocos_updated_at ON public.mentorias_blocos;
CREATE TRIGGER update_mentorias_blocos_updated_at BEFORE UPDATE ON public.mentorias_blocos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_mentorias_materiais_updated_at ON public.mentorias_materiais;
CREATE TRIGGER update_mentorias_materiais_updated_at BEFORE UPDATE ON public.mentorias_materiais FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_mentorias_sessoes_updated_at ON public.mentorias_sessoes;
CREATE TRIGGER update_mentorias_sessoes_updated_at BEFORE UPDATE ON public.mentorias_sessoes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_mentorias_agentes_updated_at ON public.mentorias_agentes;
CREATE TRIGGER update_mentorias_agentes_updated_at BEFORE UPDATE ON public.mentorias_agentes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();